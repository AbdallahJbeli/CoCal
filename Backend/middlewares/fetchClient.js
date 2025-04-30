import pool from "../database.js";

const fetchClient = async (req, res, next) => {
  try {
    const id_utilisateur = req.user.id_client;
    const [[client]] = await pool.query(
      "SELECT id, id_commercial FROM client WHERE id_utilisateur = ?",
      [id_utilisateur]
    );
    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }
    req.client = client;
    next();
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default fetchClient;
