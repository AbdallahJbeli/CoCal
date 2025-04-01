import express from "express";
import bcrypt from "bcrypt";
import pool from "../database.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-user", verifyAdmin, async (req, res) => {
  const { nom, email, motDePasse, typeUtilisateur } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM utilisateur WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      return res.status(400).json({ message: "Utilisateur déjà existant." });
    }

    const hashPassword = await bcrypt.hash(motDePasse, 10);
    const [result] = await pool.query(
      "INSERT INTO utilisateur (nom, email, motDePasse, typeUtilisateur) VALUES (?, ?, ?, ?)",
      [nom, email, hashPassword, typeUtilisateur]
    );

    if (typeUtilisateur === "Chauffeur") {
      await pool.query(
        "INSERT INTO chauffeur (id_utilisateur, disponible) VALUES (?, ?)",
        [result.insertId, 1]
      );
    }

    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
