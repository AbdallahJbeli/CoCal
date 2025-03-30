import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import createDatabaseConnection from "../database.js";

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  const { nom, email, motDePasse, typeUtilisateur } = req.body;
  try {
    const database = await createDatabaseConnection();
    const [rows] = await database.query(
      "SELECT * FROM utilisateur WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.json({ message: "l'utilisateur déjà existait" });
    }

    const hashPassword = await bcrypt.hash(motDePasse, 10);

    await database.query(
      "INSERT INTO utilisateur(nom, email, motDePasse, typeUtilisateur) VALUES (?, ?, ?, ?)",
      [nom, email, hashPassword, typeUtilisateur]
    );

    res.status(201).json({ message: "utilisateur créer avec succées" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

router.post("/login", async (req, res) => {
  const { email, motDePasse } = req.body;
  try {
    const database = await createDatabaseConnection();
    const [rows] = await database.query(
      "SELECT * FROM utilisateur WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.json({ message: "l'utilisateur n'existe pas" });
    }
    const isMatch = await bcrypt.compare(motDePasse, rows[0].motDePasse);
    if (!isMatch) {
      return res.status(401).json({ message: "mot de passe incorrect" });
    }
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_KEY, {
      expiresIn: "3h",
    });

    return res
      .status(200)
      .json({ message: "l'utilisateur est connecté", token: token });
  } catch (err) {
    return res.status(500).json(err.message);
  }
});

export default router;
