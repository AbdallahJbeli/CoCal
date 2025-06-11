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
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const [rows] = await pool.query(
      "SELECT * FROM utilisateur WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = generateJWT(user.id, user.typeUtilisateur);

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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
      return res.status(404).json({ message: "User not found." });
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
      subject: "Password Reset",
      html: `
        <p>You have requested a password reset.</p>
        <p>Click the following link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link is valid for 1 hour.</p>
        <p>If you did not request this reset, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset email sent." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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
        message: "Invalid or expired reset token.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE utilisateur SET motDePasse = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE resetToken = ?",
      [hashedPassword, token]
    );

    res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
