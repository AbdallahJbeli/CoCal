import express from "express";
import pool from "../database.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

const validateVehiculeInput = [
  body("matricule").trim().notEmpty().withMessage("Le matricule est requis"),
  body("marque")
    .optional()
    .isString()
    .withMessage("La marque doit être une chaîne de caractères"),
  body("modele")
    .optional()
    .isString()
    .withMessage("Le modèle doit être une chaîne de caractères"),
  body("capacite_kg")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La capacité doit être un nombre positif"),
  body("etat")
    .optional()
    .isIn(["disponible", "en_maintenance", "en_mission"])
    .withMessage("État invalide"),
  body("type_vehicule")
    .optional()
    .isIn(["camionette", "triporteur", "camion"])
    .withMessage("Type de véhicule invalide"),
];

const checkVehiculeExists = async (matricule, vehiculeId = null) => {
  const [existingVehicules] = await pool.query(
    "SELECT * FROM vehicule WHERE matricule = ? AND id != COALESCE(?, -1)",
    [matricule, vehiculeId]
  );
  return existingVehicules.length > 0;
};

const sendError = (res, status, message) => {
  res.status(status).json({ message });
};

router.post(
  "/create-vehicule",
  [verifyAdmin, ...validateVehiculeInput],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { matricule, marque, modele, capacite_kg, etat, type_vehicule } =
      req.body;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      if (await checkVehiculeExists(matricule)) {
        return sendError(
          res,
          400,
          "Un véhicule avec ce matricule existe déjà."
        );
      }

      const [result] = await connection.query(
        "INSERT INTO vehicule (matricule, marque, modele, capacite_kg, etat, type_vehicule) VALUES (?, ?, ?, ?, ?, ?)",
        [matricule, marque, modele, capacite_kg, etat, type_vehicule]
      );

      await connection.commit();

      res.status(201).json({ message: "Véhicule créé avec succès." });
    } catch (err) {
      await connection.rollback();
      sendError(res, 500, "Erreur lors de l'ajout de la véhicule.");
    } finally {
      connection.release();
    }
  }
);

router.get("/vehicules", verifyAdmin, async (req, res) => {
  try {
    const [vehicules] = await pool.query(`
      SELECT * FROM vehicule
      ORDER BY id DESC
    `);
    res.status(200).json(vehicules);
  } catch (err) {
    sendError(res, 500, "Erreur lors de la récupération des véhicules.");
  }
});

router.get(
  "/vehicules/:id",
  [verifyAdmin, param("id").isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      const [rows] = await pool.query(
        `SELECT * FROM vehicule
      WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return sendError(res, 404, "véhicule non touvé.");
      }

      res.status(200).json(rows[0]);
    } catch (err) {
      // console.error("Erreur récupération utilisateur:", err);
      sendError(res, 500, "Erreur lors de la récupération de la véhicule.");
    }
  }
);

router.put(
  "/vehicules/:id",
  [verifyAdmin, ...validateVehiculeInput],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { matricule, marque, modele, capacite_kg, etat, type_vehicule } =
      req.body;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [existingVehicules] = await connection.query(
        "SELECT * FROM vehicule WHERE id = ?",
        [id]
      );
      if (!existingVehicules.length) {
        return sendError(res, 404, "Véhicule non trouvé.");
      }

      if (matricule && (await checkVehiculeExists(matricule, id))) {
        return sendError(
          res,
          400,
          "Cet matricule est déjà utilisé par une autre véhicule."
        );
      }

      const updateFields = [];
      const values = [];

      if (matricule) {
        updateFields.push("matricule = ?");
        values.push(matricule);
      }
      if (marque) {
        updateFields.push("marque = ?");
        values.push(marque);
      }
      if (modele) {
        updateFields.push("modele = ?");
        values.push(modele);
      }
      if (capacite_kg) {
        updateFields.push("capacite_kg = ?");
        values.push(capacite_kg);
      }
      if (etat) {
        updateFields.push("etat = ?");
        values.push(etat);
      }
      if (type_vehicule) {
        updateFields.push("type_vehicule = ?");
        values.push(type_vehicule);
      }

      if (updateFields.length > 0) {
        values.push(id);
        await connection.query(
          `UPDATE vehicule SET ${updateFields.join(", ")} WHERE id = ?`,
          values
        );
      }

      await connection.commit();
      res.status(200).json({ message: "Véhicule modifié avec succès." });
    } catch (err) {
      await connection.rollback();
      console.error("Erreur modification véhicule:", err);
      sendError(res, 500, "Erreur lors de la modification de la véhicule.");
    } finally {
      connection.release();
    }
  }
);

router.delete(
  "/vehicules/:id",
  [verifyAdmin, param("id").isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [existingVehicules] = await connection.query(
        "SELECT * FROM vehicule WHERE id = ?",
        [id]
      );
      if (!existingVehicules.length) {
        return sendError(res, 404, "Véhicule non trouvé.");
      }

      await connection.query("DELETE FROM vehicule WHERE id = ?", [id]);

      await connection.commit();
      res.status(200).json({ message: "Véhicule supprimé avec succès." });
    } catch (err) {
      await connection.rollback();
      sendError(res, 500, "Erreur lors de la suppression du véhicule.");
    } finally {
      connection.release();
    }
  }
);

export default router;
