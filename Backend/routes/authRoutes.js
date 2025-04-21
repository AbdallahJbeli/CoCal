import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../database.js";

dotenv.config();

const router = express.Router();

const generateJWT = (id_client, typeUtilisateur) => {
  return jwt.sign({ id_client, typeUtilisateur }, process.env.JWT_KEY, {
    expiresIn: "3h",
  });
};

router.post("/login", async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    if (!email || !motDePasse) {
      return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    const [rows] = await pool.query(
      "SELECT * FROM utilisateur WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    const token = generateJWT(user.id, user.typeUtilisateur);

    return res.status(200).json({ message: "Connexion réussie", token });
  } catch (err) {
    console.error("Erreur de connexion:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Déconnexion réussie" });
});

export default router;
