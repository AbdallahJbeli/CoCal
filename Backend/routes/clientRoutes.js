import express from "express";
import pool from "../database.js";
import { verifyClient } from "../middlewares/authMiddleware.js";
import { body, validationResult } from "express-validator";
import { fetchClient } from "../middlewares/fetchUser.js";
import { createMessageRoutes } from "./messageRoutes.js";

const router = express.Router();

const demandeCollecteValidation = [
  body("type_dechet").notEmpty().withMessage("type_dechet requis"),
  body("date_souhaitee").notEmpty().withMessage("date_souhaitee requise"),
];

const sendError = (res, status, message) => {
  res.status(status).json({ message });
};

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
      latitude,
      longitude,
    } = req.body;

    const date_creation = new Date();
    const statut = "en_attente";
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        `INSERT INTO demande_collecte 
        (id_client, id_commercial, type_dechet, date_souhaitee, heure_preferee, quantite_estimee, notes_supplementaires, statut, date_creation, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          latitude || null,
          longitude || null,
        ]
      );
      await connection.commit();
      res.status(201).json({
        message: "Demande envoyée avec succès",
        demande_id: result.insertId,
      });
    } catch (err) {
      await connection.rollback();
      console.error("Erreur serveur:", err);
      sendError(res, 500, "Erreur serveur");
    } finally {
      connection.release();
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
      latitude,
      longitude,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [[demande]] = await connection.query(
        "SELECT * FROM demande_collecte WHERE id = ?",
        [id]
      );
      if (!demande) {
        await connection.rollback();
        return sendError(res, 404, "Demande introuvable");
      }
      if (demande.id_client !== req.client.id) {
        await connection.rollback();
        return sendError(res, 403, "Accès non autorisé");
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
      if (latitude !== undefined) {
        updateFields.push("latitude = ?");
        values.push(latitude);
      }
      if (longitude !== undefined) {
        updateFields.push("longitude = ?");
        values.push(longitude);
      }

      if (updateFields.length === 0) {
        await connection.rollback();
        return sendError(res, 400, "Aucune donnée à mettre à jour.");
      }

      values.push(id);

      await connection.query(
        `UPDATE demande_collecte SET ${updateFields.join(", ")} WHERE id = ?`,
        values
      );
      await connection.commit();
      res.status(200).json({ message: "Demande modifiée avec succès." });
    } catch (err) {
      await connection.rollback();
      console.error("Erreur serveur:", err);
      sendError(res, 500, "Erreur serveur");
    } finally {
      connection.release();
    }
  }
);

router.delete(
  "/demande-collecte/:id",
  verifyClient,
  fetchClient,
  async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [[demande]] = await connection.query(
        "SELECT * FROM demande_collecte WHERE id = ?",
        [id]
      );
      if (!demande) {
        await connection.rollback();
        return sendError(res, 404, "Demande introuvable");
      }
      if (demande.id_client !== req.client.id) {
        await connection.rollback();
        return sendError(res, 403, "Accès non autorisé");
      }
      await connection.query("DELETE FROM demande_collecte WHERE id = ?", [id]);
      await connection.commit();
      res.status(200).json({ message: "Demande supprimée avec succès." });
    } catch (err) {
      await connection.rollback();
      console.error("Erreur serveur:", err);
      sendError(res, 500, "Erreur serveur");
    } finally {
      connection.release();
    }
  }
);

// Add message routes
createMessageRoutes(router, 'client', verifyClient, fetchClient);

export default router;
