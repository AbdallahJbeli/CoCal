import express from "express";
import pool from "../database.js";
import { verifyCommercial } from "../middlewares/authMiddleware.js";
import fetchCommercial from "../middlewares/fetchCommercial.js";

const router = express.Router();

router.get("/clients", verifyCommercial, fetchCommercial, async (req, res) => {
  try {
    const [clients] = await pool.query(
      `SELECT 
        c.*, 
        u.nom, 
        u.email,
        COUNT(d.id) AS nombre_collectes
      FROM client c
      JOIN utilisateur u ON c.id_utilisateur = u.id
      LEFT JOIN demande_collecte d ON d.id_client = c.id
      WHERE c.id_commercial = ?
      GROUP BY c.id
      `,
      [req.commercial.id]
    );
    res.json(clients);
  } catch (err) {
    console.error("Erreur lors de la récupération des clients:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

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

router.get(
  "/clients/:clientId/collectes",
  verifyCommercial,
  fetchCommercial,
  async (req, res) => {
    try {
      const { clientId } = req.params;
      const [collectes] = await pool.query(
        `SELECT dc.*
         FROM demande_collecte dc
         JOIN client c ON dc.id_client = c.id
         WHERE dc.id_client = ? AND c.id_commercial = ? 
         ORDER BY dc.date_creation DESC`,
        [clientId, req.commercial.id]
      );
      res.json(collectes);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération des collectes du client:",
        err
      );
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

router.put(
  "/demandes/:id/statut",
  verifyCommercial,
  fetchCommercial,
  async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;
    try {
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
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
);

export default router;
