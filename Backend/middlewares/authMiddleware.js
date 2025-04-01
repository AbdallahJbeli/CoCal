import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Accès refusé. Aucun token fourni." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.typeUtilisateur !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès refusé. Autorisation requise." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide." });
  }
};
