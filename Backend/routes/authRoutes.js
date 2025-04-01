import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../database.js";

dotenv.config();

const router = express.Router();

// Login Route (For Admin & Users)
router.post("/login", async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
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

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, typeUtilisateur: user.typeUtilisateur },
      process.env.JWT_KEY,
      { expiresIn: "3h" }
    );

    return res.status(200).json({ message: "Connexion réussie", token });
  } catch (err) {
    console.error("Erreur de connexion:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
