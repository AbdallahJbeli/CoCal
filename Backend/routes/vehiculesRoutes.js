import express from "express";
import pool from "../database.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

const validateVehiculeInput = [
  body("matricule").trim().notEmpty().withMessage("Matricule is required"),
  body("marque").optional().isString().withMessage("Brand must be a string"),
  body("modele").optional().isString().withMessage("Model must be a string"),
  body("capacite_kg")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Capacity must be a positive number"),
  body("etat")
    .optional()
    .isIn(["disponible", "en_maintenance", "en_mission"])
    .withMessage("Invalid status"),
  body("type_vehicule")
    .optional()
    .isIn(["camionette", "triporteur", "camion"])
    .withMessage("Invalid vehicle type"),
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
          "A vehicle with this matricule already exists."
        );
      }

      const [result] = await connection.query(
        "INSERT INTO vehicule (matricule, marque, modele, capacite_kg, etat, type_vehicule) VALUES (?, ?, ?, ?, ?, ?)",
        [matricule, marque, modele, capacite_kg, etat, type_vehicule]
      );

      await connection.commit();

      res.status(201).json({ message: "Vehicle created successfully." });
    } catch (err) {
      await connection.rollback();
      sendError(res, 500, "Error adding vehicle.");
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
    sendError(res, 500, "Error retrieving vehicles.");
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
        return sendError(res, 404, "Vehicle not found.");
      }

      res.status(200).json(rows[0]);
    } catch (err) {
      sendError(res, 500, "Error retrieving vehicle.");
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
        return sendError(res, 404, "Vehicle not found.");
      }

      if (matricule && (await checkVehiculeExists(matricule, id))) {
        return sendError(
          res,
          400,
          "This matricule is already used by another vehicle."
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
      res.status(200).json({ message: "Vehicle updated successfully." });
    } catch (err) {
      await connection.rollback();
      console.error("Error updating vehicle:", err);
      sendError(res, 500, "Error updating vehicle.");
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
        return sendError(res, 404, "Vehicle not found.");
      }

      await connection.query("DELETE FROM vehicule WHERE id = ?", [id]);

      await connection.commit();
      res.status(200).json({ message: "Vehicle deleted successfully." });
    } catch (err) {
      await connection.rollback();
      sendError(res, 500, "Error deleting vehicle.");
    } finally {
      connection.release();
    }
  }
);

export default router;
