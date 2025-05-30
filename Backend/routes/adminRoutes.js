import express from "express";
import bcrypt from "bcrypt";
import pool from "../database.js";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
import { body, param, validationResult } from "express-validator";
import { createMessageRoutes } from "./messageRoutes.js";

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
    "SELECT id FROM utilisateur WHERE typeUtilisateur = 'Admin' AND id != COALESCE(?, -1)", // id !=?
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
  }
  // } else {
  //   await connection.query("DELETE FROM chauffeur WHERE id_utilisateur = ?", [
  //     userId,
  //   ]);
  // }

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
  }
  // } else {
  //   await connection.query("DELETE FROM client WHERE id_utilisateur = ?", [
  //     userId,
  //   ]);
  // }
};

const sendError = (res, status, message) => {
  res.status(status).json({ message });
};

router.post(
  "/create-user",
  [verifyAdmin, ...validateUserInput],
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
      // console.error("Erreur création utilisateur:", err);
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
    // console.error("Erreur récupération utilisateurs:", err);
    sendError(res, 500, "Erreur lors de la récupération des utilisateurs.");
  }
});

router.get("/users/:type", verifyAdmin, async (req, res) => {
  const { type } = req.params;
  try {
    const [users] = await pool.query(
      "SELECT id, nom FROM utilisateur WHERE LOWER(typeUtilisateur) = LOWER(?)",
      [type]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: `Aucun utilisateur de type ${type} trouvé` });
    }
    res.json(users);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs:", err);
    res.status(500).json({ message: "Erreur serveur" });
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
      sendError(res, 500, "Erreur lors de la récupération de l'utilisateur.");
    }
  }
);

router.get("/collectes", verifyAdmin, async (req, res) => {
  try {
    const [collections] = await pool.query(`
      SELECT 
        dc.*,
        u.nom as client_nom,
        ch.id as chauffeur_id,
        ch_u.nom as chauffeur_nom,
        v.id as vehicule_id,
        v.marque as vehicule_marque,
        v.modele as vehicule_modele,
        v.matricule as vehicule_matricule,
        com.nom as commercial_nom
      FROM demande_collecte dc
      JOIN client c ON dc.id_client = c.id
      JOIN utilisateur u ON c.id_utilisateur = u.id
      LEFT JOIN chauffeur ch ON dc.id_chauffeur = ch.id
      LEFT JOIN utilisateur ch_u ON ch.id_utilisateur = ch_u.id
      LEFT JOIN vehicule v ON ch.id_vehicule = v.id
      LEFT JOIN utilisateur com ON c.id_commercial = com.id
      ORDER BY dc.date_creation DESC
    `);
    res.status(200).json(collections);
  } catch (err) {
    sendError(res, 500, "Erreur lors de la récupération des collectes.");
  }
});

router.put("/collectes/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  if (!statut) {
    return sendError(res, 400, "Le statut est requis");
  }

  try {
    const [result] = await pool.query(
      "UPDATE demande_collecte SET statut = ? WHERE id = ?",
      [statut, id]
    );

    if (result.affectedRows === 0) {
      return sendError(res, 404, "Collecte non trouvée");
    }

    res.status(200).json({ message: "Statut mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du statut:", err);
    sendError(res, 500, "Erreur lors de la mise à jour du statut");
  }
});

router.put("/collectes/:id/affectation", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { id_chauffeur, id_vehicule } = req.body;

  try {
    // Update the demande with the chauffeur
    const [result] = await pool.query(
      `UPDATE demande_collecte
       SET id_chauffeur = ?
       WHERE id = ?`,
      [id_chauffeur, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    // Update the chauffeur's vehicle
    await pool.query(
      `UPDATE chauffeur SET id_vehicule = ? WHERE id = ?`,
      [id_vehicule, id_chauffeur]
    );

    // Update the vehicle status
    await pool.query(
      `UPDATE vehicule SET etat = 'en_mission' WHERE id = ?`,
      [id_vehicule]
    );

    res.json({ message: "Affectation réussie" });
  } catch (err) {
    console.error("Erreur lors de l'affectation:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.put(
  "/users/:id",
  [verifyAdmin, ...validateUserInput],
  async (req, res) => {
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
        return sendError(
          res,
          400,
          "Impossible de modifier le type d'utilisateur administrateur"
        );
      }

      if (typeUtilisateur === "Admin" && (await adminExists(id))) {
        return sendError(res, 400, "Un autre administrateur existe déjà.");
      }

      if (
        existingUser[0].typeUtilisateur.toLowerCase() === "commercial" &&
        typeUtilisateur &&
        typeUtilisateur.toLowerCase() !== "commercial"
      ) {
        const [assignedClients] = await connection.query(
          `SELECT c.id_utilisateur, u.nom 
         FROM client c
         JOIN utilisateur u ON c.id_utilisateur = u.id
         WHERE c.id_commercial = ?`,
          [id]
        );
        if (assignedClients.length > 0) {
          const clientList = assignedClients
            .map((c) => `${c.nom || "Client"} (ID: ${c.id_utilisateur})`)
            .join(", ");
          return sendError(
            res,
            400,
            `Impossible de changer le rôle : ce commercial est encore assigné aux clients suivants : ${clientList}. Veuillez réaffecter les clients avant de changer le rôle.`
          );
        }
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
      // console.error("Erreur modification utilisateur:", err);
      sendError(res, 500, "Erreur lors de la modification de l'utilisateur.");
    } finally {
      connection.release();
    }
  }
);

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

      const [user] = await connection.query(
        "SELECT typeUtilisateur FROM utilisateur WHERE id = ?",
        [id]
      );

      if (!user.length) {
        return sendError(res, 404, "Utilisateur non trouvé.");
      }

      if (user[0].typeUtilisateur.toLowerCase() === "commercial") {
        const [assignedClients] = await connection.query(
          `SELECT c.id_utilisateur, u.nom 
           FROM client c
           JOIN utilisateur u ON c.id_utilisateur = u.id
           WHERE c.id_commercial = ?`,
          [id]
        );
        if (assignedClients.length > 0) {
          const clientList = assignedClients
            .map((c) => `${c.nom || "Client"} (ID: ${c.id_utilisateur})`)
            .join(", ");
          return sendError(
            res,
            400,
            `Impossible de supprimer ce commercial : il est encore assigné aux clients suivants : ${clientList}. Veuillez réaffecter les clients avant suppression.`
          );
        }
      }

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

      sendError(res, 500, "Erreur lors de la suppression de l'utilisateur.");
    } finally {
      connection.release();
    }
  }
);

// Get all problems
router.get("/problemes", verifyAdmin, async (req, res) => {
  try {
    const [problems] = await pool.query(
      `SELECT pc.*, dc.id as id_demande, 
              u_ch.nom as chauffeur_nom,
              u_cl.nom as client_nom
       FROM problemes_collecte pc
       JOIN demande_collecte dc ON pc.id_demande = dc.id
       JOIN client cl ON dc.id_client = cl.id
       JOIN chauffeur ch ON pc.id_chauffeur = ch.id
       JOIN utilisateur u_ch ON ch.id_utilisateur = u_ch.id
       JOIN utilisateur u_cl ON cl.id_utilisateur = u_cl.id
       ORDER BY pc.date_signalement DESC`
    );
    res.json(problems);
  } catch (err) {
    console.error("Erreur lors de la récupération des problèmes:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Update problem status
router.put("/problemes/:id/status", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE problemes_collecte 
       SET statut = ?, 
           date_resolution = ${status === 'resolu' ? 'NOW()' : 'NULL'}
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Problème non trouvé" });
    }

    res.json({ message: "Statut mis à jour avec succès" });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du statut:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/chauffeurs", verifyAdmin, async (req, res) => {
  try {
    // Get all chauffeurs with their details
    const [chauffeurs] = await pool.query(
      `SELECT ch.id, u.nom, ch.disponible, v.id AS vehicule_id, v.marque, v.modele, v.matricule
       FROM chauffeur ch
       JOIN utilisateur u ON ch.id_utilisateur = u.id
       LEFT JOIN vehicule v ON ch.id_vehicule = v.id`
    );

    // For each chauffeur, get their assigned collectes
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
    console.error("Erreur lors de la récupération des chauffeurs:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

createMessageRoutes(router, 'admin', verifyAdmin, null);

export default router;
