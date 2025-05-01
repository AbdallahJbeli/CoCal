import express from "express";
import pool from "../database.js";
import { verifyCommercial } from "../middlewares/authMiddleware.js";
import fetchCommercial from "../middlewares/fetchCommercial.js";

const router = express.Router();

router.get("/demandes", verifyCommercial, fetchCommercial, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT dc.* 
       FROM demande_collecte dc
       JOIN client c ON dc.id_client = c.id
       WHERE c.id_commercial = ?
       ORDER BY dc.date_creation DESC`,
      [req.commercial.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Update the status of a demande (only if the demande belongs to a client assigned to this commercial)
router.put(
  "/demande/:id/statut",
  verifyCommercial,
  fetchCommercial,
  async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;
    try {
      // Ensure the demande belongs to a client assigned to this commercial
      const [result] = await pool.query(
        `UPDATE demande_collecte dc
       JOIN client c ON dc.id_client = c.id
       SET dc.statut = ?
       WHERE dc.id = ? AND c.id_commercial = ?`,
        [statut, id, req.commercial.id]
      );
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Demande non trouvée ou non autorisée" });
      }
      res.json({ message: "Statut mis à jour" });
    } catch (err) {
      console.error("Erreur serveur:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

export default router;
