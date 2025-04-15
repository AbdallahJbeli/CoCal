import express from "express";
import bcrypt from "bcrypt";
import pool from "../database.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-user", verifyAdmin, async (req, res) => {
  const {
    nom,
    email,
    motDePasse,
    typeUtilisateur,
    num_telephone,
    adresse,
    type_client,
  } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM utilisateur WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      return res.status(400).json({ message: "Utilisateur déjà existant." });
    }

    const hashPassword = await bcrypt.hash(motDePasse, 10);
    const [result] = await pool.query(
      "INSERT INTO utilisateur (nom, email, motDePasse, typeUtilisateur) VALUES (?, ?, ?, ?)",
      [nom, email, hashPassword, typeUtilisateur]
    );

    if (typeUtilisateur === "Chauffeur") {
      await pool.query(
        "INSERT INTO chauffeur (id_utilisateur, disponible) VALUES (?, ?)",
        [result.insertId, 1]
      );
    }

    if (typeUtilisateur === "Client") {
      await pool.query(
        "INSERT INTO client (id_utilisateur, num_telephone, adresse, type_client) VALUES (?, ?, ?, ?)",
        [result.insertId, num_telephone, adresse, type_client]
      );
    }

    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, nom, email, typeUtilisateur FROM utilisateur"
    );
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/users/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT id, nom, email, typeUtilisateur FROM utilisateur WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/users/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { nom, email, motDePasse, typeUtilisateur } = req.body;

  try {
    const updateFields = [];
    const values = [];

    if (nom) {
      updateFields.push("nom = ?");
      values.push(nom);
    }
    if (email) {
      updateFields.push("email = ?");
      values.push(email);
    }
    if (motDePasse) {
      const hashPassword = await bcrypt.hash(motDePasse, 10);
      updateFields.push("motDePasse = ?");
      values.push(hashPassword);
    }
    if (typeUtilisateur) {
      updateFields.push("typeUtilisateur = ?");
      values.push(typeUtilisateur);
    }

    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({ message: "Aucune donnée à mettre à jour." });
    }

    values.push(id);
    await pool.query(
      `UPDATE utilisateur SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    );

    if (typeUtilisateur === "Chauffeur") {
      const [existingChauffeur] = await pool.query(
        "SELECT * FROM chauffeur WHERE id_utilisateur = ?",
        [id]
      );

      if (existingChauffeur.length === 0) {
        await pool.query(
          "INSERT INTO chauffeur (id_utilisateur, disponible) VALUES (?, ?)",
          [id, 1]
        );
      }
    } else {
      await pool.query("DELETE FROM chauffeur WHERE id_utilisateur = ?", [id]);
    }
    if (typeUtilisateur === "Client") {
      const [existingClient] = await pool.query(
        "SELECT * FROM client WHERE id_utilisateur = ?",
        [id]
      );

      if (existingClient.length === 0) {
        await pool.query(
          "INSERT INTO client (id_utilisateur, num_telephone, adresse, type_client) VALUES (?, ?, ?, ?)",
          [id, num_telephone, adresse, type_client]
        );
      }
    } else {
      await pool.query("DELETE FROM client WHERE id_utilisateur = ?", [id]);
    }

    res.status(200).json({ message: "Utilisateur modifié avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/users/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM utilisateur WHERE id = ?", [id]);
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
