import pool from "../database.js";

// Get users by type
export const getUsersByType = async (req, res) => {
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
};

export const createMessageRoutes = (router, userType, verifyMiddleware, fetchMiddleware) => {
  // Create middleware array, only including fetchMiddleware if it's provided
  const middleware = [verifyMiddleware];
  if (fetchMiddleware) {
    middleware.push(fetchMiddleware);
  }

  // Get all messages for user
  router.get("/messages", ...middleware, async (req, res) => {
    try {
      const [messages] = await pool.query(`
        SELECT m.*, 
          sender.nom as sender_nom,
          receiver.nom as receiver_nom
        FROM messages m
        JOIN utilisateur sender ON m.sender_id = sender.id
        JOIN utilisateur receiver ON m.receiver_id = receiver.id
        WHERE m.sender_id = ? OR m.receiver_id = ?
        ORDER BY m.date_envoi DESC
      `, [req.user.id, req.user.id]);
      res.json(messages);
    } catch (err) {
      console.error("Erreur lors de la récupération des messages:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Send a message
  router.post("/messages", ...middleware, async (req, res) => {
    const { receiver_id, receiver_type, subject, message } = req.body;

    try {
      // Verify receiver exists
      const [receiver] = await pool.query(
        "SELECT id FROM utilisateur WHERE id = ? AND LOWER(typeUtilisateur) = LOWER(?)",
        [receiver_id, receiver_type]
      );

      if (receiver.length === 0) {
        return res.status(404).json({ message: "Destinataire non trouvé" });
      }

      const [result] = await pool.query(
        `INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, subject, message)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, userType.toLowerCase(), receiver_id, receiver_type.toLowerCase(), subject, message]
      );

      res.status(201).json({ 
        message: "Message envoyé avec succès",
        messageId: result.insertId 
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Mark message as read
  router.put("/messages/:id/read", ...middleware, async (req, res) => {
    const { id } = req.params;

    try {
      const [result] = await pool.query(
        `UPDATE messages 
         SET is_read = 1 
         WHERE id = ? AND receiver_id = ?`,
        [id, req.user.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Message non trouvé" });
      }

      res.json({ message: "Message marqué comme lu" });
    } catch (err) {
      console.error("Erreur lors de la mise à jour du message:", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
}; 