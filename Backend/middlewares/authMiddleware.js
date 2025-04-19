import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(403)
        .json({ message: "Accès refusé. Aucun token fourni." });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      if (decoded.typeUtilisateur !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Accès refusé. Autorisation requise." });
      }

      req.user = decoded; // contains id_client and typeUtilisateur
      next();
    } catch (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(401).json({ message: "Token invalide." });
    }
  };
};

export const verifyAdmin = verifyRole("admin");
export const verifyClient = verifyRole("client");
