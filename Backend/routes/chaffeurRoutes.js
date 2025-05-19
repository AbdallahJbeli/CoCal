import express from "express";
import pool from "../database.js";
import { verifyChauffeur } from "../middlewares/authMiddleware.js";
import fetchChauffeur from "../middlewares/fetchChauffeur.js";

const router = express.Router();

// Get all collectes assigned to the connected chauffeur
router.get("/collectes", verifyChauffeur, fetchChauffeur, async (req, res) => {
  try {
    const [collectes] = await pool.query(
      `SELECT * FROM demande_collecte WHERE id_chauffeur = ? ORDER BY date_creation DESC`,
      [req.chauffeur.id]
    );
    res.json(collectes);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
