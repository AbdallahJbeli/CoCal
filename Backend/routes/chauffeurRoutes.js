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
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Update collection status
router.put("/collectes/:id/status", verifyChauffeur, fetchChauffeur, async (req, res) => {
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
      return res.status(404).json({ message: "Collecte non trouvée ou non autorisée" });
    }

    res.json({ message: "Statut mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du statut:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Report a problem
router.post("/collectes/:id/problem", verifyChauffeur, fetchChauffeur, async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    // First, get the collection details to find the commercial
    const [[collection]] = await pool.query(
      `SELECT dc.*, c.id_commercial 
       FROM demande_collecte dc
       JOIN client cl ON dc.id_client = cl.id
       JOIN client c ON cl.id = c.id
       WHERE dc.id = ? AND dc.id_chauffeur = ?`,
      [id, req.chauffeur.id]
    );

    if (!collection) {
      return res.status(404).json({ message: "Collecte non trouvée ou non autorisée" });
    }

    // Insert the problem report
    await pool.query(
      `INSERT INTO problemes_collecte (id_demande, id_chauffeur, description, date_signalement, statut)
       VALUES (?, ?, ?, NOW(), 'en_attente')`,
      [id, req.chauffeur.id, description]
    );

    // Update collection status to indicate there's a problem
    await pool.query(
      `UPDATE demande_collecte 
       SET statut = 'probleme' 
       WHERE id = ?`,
      [id]
    );

    res.json({ message: "Problème signalé avec succès" });
  } catch (err) {
    console.error("Erreur lors du signalement du problème:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Get users by type
router.get("/users/:type", verifyChauffeur, fetchChauffeur, async (req, res) => {
  const { type } = req.params;
  try {
    const [users] = await pool.query(
      "SELECT id, nom FROM utilisateur WHERE LOWER(typeUtilisateur) = LOWER(?)",
      [type]
    );
    res.json(users);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Add message routes
createMessageRoutes(router, 'chauffeur', verifyChauffeur, fetchChauffeur);

export default router; 