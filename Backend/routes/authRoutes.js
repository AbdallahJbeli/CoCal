import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../database.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

const router = express.Router();

const generateJWT = (id, typeUtilisateur) => {
  return jwt.sign({ id, typeUtilisateur }, process.env.JWT_KEY, {
    expiresIn: "3h",
  });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM utilisateur WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await pool.query(
      "UPDATE utilisateur SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?",
      [resetToken, resetTokenExpiry, email]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Réinitialisation de mot de passe",
      html: `
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ce lien est valable pendant 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email de réinitialisation envoyé." });
  } catch (err) {
    console.error("Erreur lors de la demande de réinitialisation:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM utilisateur WHERE resetToken = ? AND resetTokenExpiry > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Token de réinitialisation invalide ou expiré.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE utilisateur SET motDePasse = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = ?",
      [hashedPassword, token]
    );

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
