import express from "express";
import pool from "../database.js";
import {
  verifyAdminOrCommercial,
  verifyCommercial,
} from "../middlewares/authMiddleware.js";
import { fetchCommercial } from "../middlewares/fetchUser.js";
import { createMessageRoutes } from "./messageRoutes.js";

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
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get(
  "/demandes",
  verifyAdminOrCommercial,
  fetchCommercial,
  async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT dc.*, 
          u.nom AS client_nom,
          ch.id AS chauffeur_id,
          ch_u.nom AS chauffeur_nom,
          v.id AS vehicule_id,
          v.marque AS vehicule_marque,
          v.modele AS vehicule_modele,
          v.matricule AS vehicule_matricule
        FROM demande_collecte dc
        JOIN client c ON dc.id_client = c.id
        JOIN utilisateur u ON c.id_utilisateur = u.id
        LEFT JOIN chauffeur ch ON dc.id_chauffeur = ch.id
        LEFT JOIN utilisateur ch_u ON ch.id_utilisateur = ch_u.id
        LEFT JOIN vehicule v ON ch.id_vehicule = v.id
        WHERE c.id_commercial = ?
        ORDER BY dc.date_creation DESC`,
        [req.commercial.id]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

router.get(
  "/clients/:clientId/collectes",
  verifyAdminOrCommercial,
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

router.get(
  "/chauffeurs",
  verifyAdminOrCommercial,
  fetchCommercial,
  async (req, res) => {
    try {
      const [chauffeurs] = await pool.query(
        `SELECT ch.id, u.nom, v.id AS vehicule_id, v.marque, v.modele, v.matricule
         FROM chauffeur ch
         JOIN utilisateur u ON ch.id_utilisateur = u.id
         LEFT JOIN vehicule v ON ch.id_vehicule = v.id
         WHERE ch.disponible = 1`
      );

      for (const chauffeur of chauffeurs) {
        const [collectes] = await pool.query(
          `SELECT id, type_dechet, date_souhaitee, heure_preferee, statut
           FROM demande_collecte
           WHERE id_chauffeur = ?`,
          [chauffeur.id]
        );
        chauffeur.collectes = collectes;
      }

      res.json(chauffeurs);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

router.get(
  "/vehicules-disponibles",
  verifyAdminOrCommercial,
  fetchCommercial,
  async (req, res) => {
    try {
      const [vehicules] = await pool.query(
        `SELECT id, matricule, marque, modele, capacite_kg, type_vehicule
         FROM vehicule
         WHERE etat = 'disponible'`
      );
      res.json(vehicules);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
);

router.put(
  "/demandes/:id/affectation",
  verifyAdminOrCommercial,
  fetchCommercial,
  async (req, res) => {
    const { id } = req.params;
    const { id_chauffeur, id_vehicule } = req.body;

    const isAdmin = req.user.typeUtilisateur === "admin";

    try {
      let result;
      if (isAdmin) {
        [result] = await pool.query(
          `UPDATE demande_collecte
           SET id_chauffeur = ?
           WHERE id = ?`,
          [id_chauffeur, id]
        );
      } else {
        [result] = await pool.query(
          `UPDATE demande_collecte dc
           JOIN client c ON dc.id_client = c.id
           SET dc.id_chauffeur = ?
           WHERE dc.id = ? AND c.id_commercial = ?`,
          [id_chauffeur, id, req.commercial.id]
        );
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Demande non trouvée ou non autorisée" });
      }

      await pool.query(`UPDATE chauffeur SET id_vehicule = ? WHERE id = ?`, [
        id_vehicule,
        id_chauffeur,
      ]);

      await pool.query(`UPDATE vehicule SET etat = 'en_mission' WHERE id = ?`, [
        id_vehicule,
      ]);

      res.json({ message: "Affectation réussie" });
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
);



router.get(
  "/users/:type",
  verifyCommercial,
  fetchCommercial,
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

createMessageRoutes(router, "commercial", verifyCommercial, fetchCommercial);

export default router;
