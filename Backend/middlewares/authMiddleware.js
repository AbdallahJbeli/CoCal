import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_KEY) {
  throw new Error("JWT_KEY is not defined in environment variables.");
}

export const verifyRole = (...requiredRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Accès refusé. Aucun token fourni." });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);

      if (!requiredRoles.includes(decodedToken.typeUtilisateur)) {
        return res
          .status(403)
          .json({ message: "Accès refusé. Autorisation requise." });
      }

      req.user = decodedToken;
      next();
    } catch (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(401).json({ message: "Token invalide." });
    }
  };
};

export const verifyAdmin = verifyRole("admin");
export const verifyClient = verifyRole("client");
