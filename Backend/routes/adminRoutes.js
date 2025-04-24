import express from "express";
import bcrypt from "bcrypt";
import pool from "../database.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

const validateUserInput = [
  body("nom").trim().notEmpty().withMessage("Le nom est requis"),
  body("email").isEmail().withMessage("Email invalide"),
  body("motDePasse")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("typeUtilisateur")
    .isIn(["Admin", "Commercial", "Client", "Chauffeur"])
    .withMessage("Type d'utilisateur invalide"),
  body("num_telephone")
    .optional()
    .matches(/^[0-9+\s-]+$/)
    .withMessage("Numéro de téléphone invalide"),
  body("disponible").optional().isBoolean(),
];

const checkUserExists = async (email, userId = null) => {
  const [existingUsers] = await pool.query(
    "SELECT * FROM utilisateur WHERE email = ? AND id != COALESCE(?, -1)",
    [email, userId]
  );
  return existingUsers.length > 0;
};

const adminExists = async (excludeUserId = null) => {
  const [admins] = await pool.query(
    "SELECT id FROM utilisateur WHERE typeUtilisateur = 'Admin' AND id != COALESCE(?, -1)",
    [excludeUserId]
  );
  return admins.length > 0;
};

const handleRoleInsertion = async (
  connection,
  userId,
  typeUtilisateur,
  data
) => {
  const { num_telephone, adresse, type_client, id_commercial, disponible } =
    data;

  if (typeUtilisateur === "Chauffeur") {
    await connection.query(
      "INSERT INTO chauffeur (id_utilisateur, disponible) VALUES (?, ?) ON DUPLICATE KEY UPDATE disponible = VALUES(disponible)",
      [userId, disponible !== undefined ? disponible : 1]
    );
  } else {
    await connection.query("DELETE FROM chauffeur WHERE id_utilisateur = ?", [
      userId,
    ]);
  }

  if (typeUtilisateur === "Client") {
    await connection.query(
      `INSERT INTO client (id_utilisateur, num_telephone, adresse, type_client, id_commercial) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       num_telephone = VALUES(num_telephone),
       adresse = VALUES(adresse),
       type_client = VALUES(type_client),
       id_commercial = VALUES(id_commercial)`,
      [userId, num_telephone, adresse, type_client, id_commercial]
    );
  } else {
    await connection.query("DELETE FROM client WHERE id_utilisateur = ?", [
      userId,
    ]);
  }
};

const sendError = (res, status, message) => {
  res.status(status).json({ message });
};

router.post(
  "/create-user",
  [verifyAdmin, validateUserInput],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nom, email, motDePasse, typeUtilisateur, ...roleData } = req.body;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      if (await checkUserExists(email)) {
        return sendError(res, 400, "Cet email est déjà utilisé.");
      }

      if (typeUtilisateur === "Admin" && (await adminExists())) {
        return sendError(res, 400, "Un administrateur existe déjà.");
      }

      const hashPassword = await bcrypt.hash(motDePasse, 10);
      const [result] = await connection.query(
        "INSERT INTO utilisateur (nom, email, motDePasse, typeUtilisateur) VALUES (?, ?, ?, ?)",
        [nom, email, hashPassword, typeUtilisateur]
      );

      await handleRoleInsertion(
        connection,
        result.insertId,
        typeUtilisateur,
        roleData
      );
      await connection.commit();

      res.status(201).json({ message: "Utilisateur créé avec succès." });
    } catch (err) {
      await connection.rollback();
      console.error("Erreur création utilisateur:", err);
      sendError(res, 500, "Erreur lors de la création de l'utilisateur.");
    } finally {
      connection.release();
    }
  }
);

router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        u.id, 
        u.nom, 
        u.email, 
        u.typeUtilisateur,
        c.num_telephone,
        c.adresse,
        c.type_client,
        c.id_commercial,
        ch.disponible
      FROM utilisateur u
      LEFT JOIN client c ON u.id = c.id_utilisateur
      LEFT JOIN chauffeur ch ON u.id = ch.id_utilisateur
      ORDER BY u.id DESC
    `);
    res.status(200).json(users);
  } catch (err) {
    console.error("Erreur récupération utilisateurs:", err);
    sendError(res, 500, "Erreur lors de la récupération des utilisateurs.");
  }
});

router.get(
  "/users/:id",
  [verifyAdmin, param("id").isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    try {
      const [rows] = await pool.query(
        `SELECT 
        u.id, 
        u.nom, 
        u.email, 
        u.typeUtilisateur,
        c.num_telephone,
        c.adresse,
        c.type_client,
        c.id_commercial,
        ch.disponible
      FROM utilisateur u
      LEFT JOIN client c ON u.id = c.id_utilisateur
      LEFT JOIN chauffeur ch ON u.id = ch.id_utilisateur
      WHERE u.id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return sendError(res, 404, "Utilisateur non trouvé.");
      }

      res.status(200).json(rows[0]);
    } catch (err) {
      console.error("Erreur récupération utilisateur:", err);
      sendError(res, 500, "Erreur lors de la récupération de l'utilisateur.");
    }
  }
);

router.put("/users/:id", [verifyAdmin, validateUserInput], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { nom, email, motDePasse, typeUtilisateur, ...roleData } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingUser] = await connection.query(
      "SELECT * FROM utilisateur WHERE id = ?",
      [id]
    );
    if (!existingUser.length) {
      return sendError(res, 404, "Utilisateur non trouvé.");
    }

    if (email && (await checkUserExists(email, id))) {
      return sendError(
        res,
        400,
        "Cet email est déjà utilisé par un autre utilisateur."
      );
    }

    if (
      existingUser[0].typeUtilisateur.toLowerCase() === "admin" &&
      req.body.typeUtilisateur &&
      req.body.typeUtilisateur.toLowerCase() !== "admin"
    ) {
      return sendError(res, 400, "Cannot change admin user type");
    }

    if (typeUtilisateur === "Admin" && (await adminExists(id))) {
      return sendError(res, 400, "Un autre administrateur existe déjà.");
    }

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
      updateFields.push("motDePasse = ?");
      values.push(await bcrypt.hash(motDePasse, 10));
    }
    if (typeUtilisateur) {
      updateFields.push("typeUtilisateur = ?");
      values.push(typeUtilisateur);
    }

    if (updateFields.length > 0) {
      values.push(id);
      await connection.query(
        `UPDATE utilisateur SET ${updateFields.join(", ")} WHERE id = ?`,
        values
      );
    }

    if (typeUtilisateur) {
      await handleRoleInsertion(connection, id, typeUtilisateur, roleData);
    }

    await connection.commit();
    res.status(200).json({ message: "Utilisateur modifié avec succès." });
  } catch (err) {
    await connection.rollback();
    console.error("Erreur modification utilisateur:", err);
    sendError(res, 500, "Erreur lors de la modification de l'utilisateur.");
  } finally {
    connection.release();
  }
});

router.delete(
  "/users/:id",
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

      const [adminCount] = await connection.query(
        "SELECT COUNT(*) AS count FROM utilisateur WHERE typeUtilisateur = 'Admin'"
      );

      const [user] = await connection.query(
        "SELECT typeUtilisateur FROM utilisateur WHERE id = ?",
        [id]
      );

      if (
        adminCount[0].count <= 1 &&
        user.length > 0 &&
        user[0].typeUtilisateur === "Admin"
      ) {
        return sendError(
          res,
          400,
          "Vous ne pouvez pas supprimer le seul administrateur."
        );
      }

      // Set id_commercial to NULL for clients assigned to this commercial
      await connection.query(
        "UPDATE client SET id_commercial = NULL WHERE id_commercial = ?",
        [id]
      );

      await connection.query("DELETE FROM chauffeur WHERE id_utilisateur = ?", [
        id,
      ]);
      await connection.query("DELETE FROM client WHERE id_utilisateur = ?", [
        id,
      ]);

      const [result] = await connection.query(
        "DELETE FROM utilisateur WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return sendError(res, 404, "Utilisateur non trouvé.");
      }

      await connection.commit();
      res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    } catch (err) {
      await connection.rollback();
      console.error("Erreur suppression utilisateur:", err);
      sendError(res, 500, "Erreur lors de la suppression de l'utilisateur.");
    } finally {
      connection.release();
    }
  }
);

export default router;
