import React, { useEffect, useState } from "react";
import { Trash2, CalendarClock, Scale, MapPin } from "lucide-react";

const CollectesList = ({ demandes, loading, onStatusChange }) => {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [selectedChauffeur, setSelectedChauffeur] = useState({});
  const [selectedVehicule, setSelectedVehicule] = useState({});
  const [fetchError, setFetchError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setFetchError("Aucun token trouvé. Veuillez vous reconnecter.");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const chauffeurRes = await fetch(
          "http://localhost:5000/commercial/chauffeurs",
          { headers }
        );

        const vehiculeRes = await fetch(
          "http://localhost:5000/commercial/vehicules-disponibles",
          { headers }
        );

        if (!chauffeurRes.ok || !vehiculeRes.ok) {
          throw new Error(
            `Erreur serveur : ${chauffeurRes.status}, ${vehiculeRes.status}`
          );
        }

        const chauffeurData = await chauffeurRes.json();
        const vehiculeData = await vehiculeRes.json();

        // Ensure data is an array
        setChauffeurs(Array.isArray(chauffeurData) ? chauffeurData : []);
        setVehicules(Array.isArray(vehiculeData) ? vehiculeData : []);
        setFetchError(null);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setFetchError("Impossible de charger les chauffeurs ou véhicules.");
        setChauffeurs([]);
        setVehicules([]);
      }
    };

    fetchData();
  }, [token]);

  const handleAffectation = async (demandeId) => {
    const chauffeurId = selectedChauffeur[demandeId];
    const vehiculeId = selectedVehicule[demandeId];

    if (!chauffeurId || !vehiculeId) return;

    const url = `http://localhost:5000/commercial/demandes/${demandeId}/affectation`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const body = JSON.stringify({
      id_chauffeur: chauffeurId,
      id_vehicule: vehiculeId,
    });

    try {
      const res = await fetch(url, { method: "PUT", headers, body });
      if (res.ok) {
        alert("Affectation réussie !");
      } else {
        alert("Échec de l'affectation.");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de l'affectation.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Mes Collectes Assignées
      </h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Chargement...</p>
      ) : fetchError ? (
        <p className="text-red-600 text-sm">{fetchError}</p>
      ) : demandes.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucune collecte trouvée.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-200">
          {demandes.map((d) => (
            <div
              key={d.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="space-y-2 text-sm text-gray-700 md:w-2/3">
                <div className="flex items-center justify-between md:justify-start md:gap-4">
                  <span
                    className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${
                      d.statut === "en_attente"
                        ? "bg-yellow-100 text-yellow-800"
                        : d.statut === "en_cours"
                        ? "bg-blue-100 text-blue-800"
                        : d.statut === "terminee"
                        ? "bg-green-100 text-green-800"
                        : d.statut === "annulee"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {d.statut}
                  </span>

                  <select
                    value={d.statut}
                    onChange={(e) => onStatusChange(d.id, e.target.value)}
                    className="ml-2 border-gray-300 text-sm rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="en_cours">En cours</option>
                    <option value="terminee">Terminée</option>
                    <option value="annulee">Annulée</option>
                  </select>
                </div>

                <p className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-gray-500" />
                  <strong>{d.type_dechet}</strong>
                </p>

                <p className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-gray-500" />
                  {new Date(d.date_souhaitee).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                  })}{" "}
                  à {d.heure_preferee}
                </p>

                <p className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-gray-500" />
                  {d.quantite_estimee} kg
                </p>

                {d.notes_supplementaires && (
                  <div className="bg-gray-50 p-2 rounded text-gray-600">
                    {d.notes_supplementaires}
                  </div>
                )}

                {d.latitude && d.longitude && (
                  <a
                    href={`https://www.openstreetmap.org/?mlat= ${d.latitude}&mlon=${d.longitude}#map=18/${d.latitude}/${d.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-green-700 hover:underline mt-1"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Voir la localisation
                  </a>
                )}
              </div>

              {/* Action Controls */}
              <div className="mt-4 md:mt-0 flex flex-col gap-2 md:w-1/3">
                <select
                  className="border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-2 focus:ring-green-500"
                  value={selectedChauffeur[d.id] || ""}
                  onChange={(e) =>
                    setSelectedChauffeur((prev) => ({
                      ...prev,
                      [d.id]: e.target.value,
                    }))
                  }
                >
                  <option value="">Chauffeur...</option>
                  {Array.isArray(chauffeurs) && chauffeurs.length > 0 ? (
                    chauffeurs.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.nom}
                      </option>
                    ))
                  ) : (
                    <option disabled>Aucun chauffeur disponible</option>
                  )}
                </select>

                <select
                  className="border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-2 focus:ring-green-500"
                  value={selectedVehicule[d.id] || ""}
                  onChange={(e) =>
                    setSelectedVehicule((prev) => ({
                      ...prev,
                      [d.id]: e.target.value,
                    }))
                  }
                >
                  <option value="">Véhicule...</option>
                  {Array.isArray(vehicules) && vehicules.length > 0 ? (
                    vehicules.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.marque} {v.modele} ({v.matricule})
                      </option>
                    ))
                  ) : (
                    <option disabled>Aucun véhicule disponible</option>
                  )}
                </select>

                <button
                  onClick={() => handleAffectation(d.id)}
                  disabled={!selectedChauffeur[d.id] || !selectedVehicule[d.id]}
                  className={`w-full px-4 py-1 rounded-md text-white text-sm transition ${
                    !selectedChauffeur[d.id] || !selectedVehicule[d.id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Affecter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectesList;
