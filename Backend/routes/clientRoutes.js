import express from "express";
import pool from "../database.js";
import { verifyClient } from "../middlewares/authMiddleware.js";
import { body, validationResult } from "express-validator";
import fetchClient from "../middlewares/fetchClient.js";

const router = express.Router();

const demandeCollecteValidation = [
  body("type_dechet").notEmpty().withMessage("type_dechet requis"),
  body("date_souhaitee").notEmpty().withMessage("date_souhaitee requise"),
];

router.post(
  "/demande-collecte",
  verifyClient,
  fetchClient,
  demandeCollecteValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      type_dechet,
      date_souhaitee,
      heure_preferee,
      quantite_estimee,
      notes_supplementaires,
    } = req.body;

    const date_creation = new Date();
    const statut = "en_attente";

    try {
      const [result] = await pool.query(
        `INSERT INTO demande_collecte 
        (id_client, id_commercial, type_dechet, date_souhaitee, heure_preferee, quantite_estimee, notes_supplementaires, statut, date_creation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.client.id,
          req.client.id_commercial,
          type_dechet,
          date_souhaitee,
          heure_preferee,
          quantite_estimee,
          notes_supplementaires,
          statut,
          date_creation,
        ]
      );
      res.status(201).json({
        message: "Demande envoyée avec succès",
        demande_id: result.insertId,
      });
    } catch (err) {
      console.error("Erreur serveur:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

router.get("/demande-collecte", verifyClient, fetchClient, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM demande_collecte WHERE id_client = ? ORDER BY date_creation DESC",
      [req.client.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put(
  "/demande-collecte/:id",
  verifyClient,
  fetchClient,
  demandeCollecteValidation,
  async (req, res) => {
    const { id } = req.params;
    const {
      type_dechet,
      date_souhaitee,
      heure_preferee,
      quantite_estimee,
      notes_supplementaires,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [[demande]] = await pool.query(
        "SELECT * FROM demande_collecte WHERE id = ?",
        [id]
      );
      if (!demande) {
        return res.status(404).json({ message: "Demande introuvable" });
      }
      if (demande.id_client !== req.client.id) {
        return res.status(403).json({ message: "Accès non autorisé" });
      }

      const updateFields = [];
      const values = [];

      if (type_dechet) {
        updateFields.push("type_dechet = ?");
        values.push(type_dechet);
      }
      if (date_souhaitee) {
        updateFields.push("date_souhaitee = ?");
        values.push(date_souhaitee);
      }
      if (heure_preferee) {
        updateFields.push("heure_preferee = ?");
        values.push(heure_preferee);
      }
      if (quantite_estimee) {
        updateFields.push("quantite_estimee = ?");
        values.push(quantite_estimee);
      }
      if (notes_supplementaires) {
        updateFields.push("notes_supplementaires = ?");
        values.push(notes_supplementaires);
      }

      if (updateFields.length === 0) {
        return res
          .status(400)
          .json({ message: "Aucune donnée à mettre à jour." });
      }

      values.push(id);

      await pool.query(
        `UPDATE demande_collecte SET ${updateFields.join(", ")} WHERE id = ?`,
        values
      );

      res.status(200).json({ message: "Demande modifiée avec succès." });
    } catch (err) {
      console.error("Erreur serveur:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// DELETE: Supprimer une demande de collecte
router.delete(
  "/demande-collecte/:id",
  verifyClient,
  fetchClient,
  async (req, res) => {
    const { id } = req.params;

    try {
      const [[demande]] = await pool.query(
        "SELECT * FROM demande_collecte WHERE id = ?",
        [id]
      );
      if (!demande) {
        return res.status(404).json({ message: "Demande introuvable" });
      }
      if (demande.id_client !== req.client.id) {
        return res.status(403).json({ message: "Accès non autorisé" });
      }

      await pool.query("DELETE FROM demande_collecte WHERE id = ?", [id]);
      res.status(200).json({ message: "Demande supprimée avec succès." });
    } catch (err) {
      console.error("Erreur serveur:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

export default router;
