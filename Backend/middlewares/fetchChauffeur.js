import pool from "../database.js";

const fetchChauffeur = async (req, res, next) => {
  try {
    const id_utilisateur = req.user.id;

    if (!id_utilisateur) {
      return res
        .status(401)
        .json({ message: "Non autorisé: ID utilisateur manquant" });
    }

    const [[chauffeur]] = await pool.query(
      "SELECT id FROM chauffeur WHERE id_utilisateur = ?",
      [id_utilisateur]
    );

    if (!chauffeur) {
      return res.status(404).json({ message: "Chauffeur introuvable" });
    }

    req.chauffeur = chauffeur;
    next();
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default fetchChauffeur;
