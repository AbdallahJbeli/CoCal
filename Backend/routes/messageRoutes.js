import pool from "../database.js";

export const getUsersByType = async (req, res) => {
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
};

export const createMessageRoutes = (
  router,
  userType,
  verifyMiddleware,
  fetchMiddleware
) => {
  const middleware = [verifyMiddleware];
  if (fetchMiddleware) {
    middleware.push(fetchMiddleware);
  }

  router.get("/messages", ...middleware, async (req, res) => {
    try {
      const [messages] = await pool.query(
        `
        SELECT m.*, 
          sender.nom as sender_nom,
          receiver.nom as receiver_nom
        FROM messages m
        JOIN utilisateur sender ON m.sender_id = sender.id
        JOIN utilisateur receiver ON m.receiver_id = receiver.id
        WHERE m.sender_id = ? OR m.receiver_id = ?
        ORDER BY m.date_envoi DESC
      `,
        [req.user.id, req.user.id]
      );
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  router.post("/messages", ...middleware, async (req, res) => {
    const { receiver_id, receiver_type, subject, message } = req.body;

    try {
      const [receiver] = await pool.query(
        "SELECT id FROM utilisateur WHERE id = ? AND LOWER(typeUtilisateur) = LOWER(?)",
        [receiver_id, receiver_type]
      );

      if (receiver.length === 0) {
        return res.status(404).json({ message: "Recipient not found" });
      }

      const [result] = await pool.query(
        `INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, subject, message)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          userType.toLowerCase(),
          receiver_id,
          receiver_type.toLowerCase(),
          subject,
          message,
        ]
      );

      res.status(201).json({
        message: "Message sent successfully",
        messageId: result.insertId,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

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
        return res.status(404).json({ message: "Message not found" });
      }

      res.json({ message: "Message marked as read" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  router.delete("/messages/:id", ...middleware, async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query(
        `DELETE FROM messages WHERE id = ? AND (sender_id = ? OR receiver_id = ?)`,
        [id, req.user.id, req.user.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json({ message: "Message deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
};
