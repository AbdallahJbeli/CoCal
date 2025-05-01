import pool from "../database.js";

const fetchCommercial = async (req, res, next) => {
  try {
    // console.log("Decoded user:", req.user);
    // console.log("fetchCommercial req.user:", req.user);

    const id_utilisateur = req.user.id;

    if (!id_utilisateur) {
      return res
        .status(401)
        .json({ message: "Non autorisé: ID utilisateur manquant" });
    }

    const [[commercial]] = await pool.query(
      "SELECT id, nom, email FROM utilisateur WHERE id = ? AND typeUtilisateur = ?",
      [id_utilisateur, req.user.typeUtilisateur]
    );

    if (!commercial) {
      return res.status(404).json({ message: "Commercial introuvable" });
    }

    req.commercial = commercial;
    next();
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export default fetchCommercial;
