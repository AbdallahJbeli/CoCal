import express from "express";
import pool from "../database.js";
import { verifyChauffeur } from "../middlewares/authMiddleware.js";
import { fetchChauffeur } from "../middlewares/fetchUser.js";
import { createMessageRoutes } from "./messageRoutes.js";

const router = express.Router();

router.get("/collectes", verifyChauffeur, fetchChauffeur, async (req, res) => {
  try {
    const [collectes] = await pool.query(
      `SELECT * FROM demande_collecte WHERE id_chauffeur = ? ORDER BY date_creation DESC`,
      [req.chauffeur.id]
    );
    res.json(collectes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put(
  "/collectes/:id/status",
  verifyChauffeur,
  fetchChauffeur,
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const [result] = await pool.query(
        `UPDATE demande_collecte 
       SET statut = ? 
       WHERE id = ? AND id_chauffeur = ?`,
        [status, id, req.chauffeur.id]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Collection not found or not authorized" });
      }

      res.json({ message: "Status updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/users/:type",
  verifyChauffeur,
  fetchChauffeur,
  async (req, res) => {
    const { type } = req.params;
    try {
      const [users] = await pool.query(
        "SELECT id, nom FROM utilisateur WHERE LOWER(typeUtilisateur) = LOWER(?)",
        [type]
      );
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

createMessageRoutes(router, "chauffeur", verifyChauffeur, fetchChauffeur);

export default router;
