import pool from "../database.js";

const ERRORS = {
  UNAUTHORIZED: "Non autorisé: ID utilisateur manquant",
  NOT_FOUND: (type) => `${type} introuvable`,
  SERVER: "Erreur serveur"
};

const fetchUser = (userType) => async (req, res, next) => {
  try {
    const id_utilisateur = req.user.id;

    if (!id_utilisateur) {
      return res.status(401).json({ message: ERRORS.UNAUTHORIZED });
    }

    let query;
    let params = [id_utilisateur];

    switch (userType) {
      case 'chauffeur':
        query = "SELECT id FROM chauffeur WHERE id_utilisateur = ?";
        break;
      case 'commercial':
        query = "SELECT id FROM utilisateur WHERE id = ? AND typeUtilisateur = ?";
        params.push(req.user.typeUtilisateur);
        break;
      case 'client':
        query = "SELECT id, id_commercial FROM client WHERE id_utilisateur = ?";
        break;
      default:
        return res.status(400).json({ message: "Type d'utilisateur invalide" });
    }

    const [[user]] = await pool.query(query, params);

    if (!user) {
      return res.status(404).json({ message: ERRORS.NOT_FOUND(userType) });
    }

    req[userType] = user;
    next();
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ message: ERRORS.SERVER });
  }
};

export const fetchChauffeur = fetchUser('chauffeur');
export const fetchCommercial = fetchUser('commercial');
export const fetchClient = fetchUser('client'); 