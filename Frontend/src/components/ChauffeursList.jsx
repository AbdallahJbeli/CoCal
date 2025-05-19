import React from "react";

const ChauffeursList = ({ chauffeurs, loading }) => (
  <div>
    <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-base">
        🚚
      </span>
      Chauffeurs
    </h2>
    {loading ? (
      <div className="flex justify-center items-center h-32">
        <span className="loader border-green-600"></span>
        <span className="ml-3 text-green-700 font-medium">Chargement...</span>
      </div>
    ) : chauffeurs.length === 0 ? (
      <div className="text-center py-10 text-gray-500 text-lg">
        Aucun chauffeur trouvé.
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chauffeurs.map((ch) => (
          <div
            key={ch.id}
            className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-green-100"
          >
            <div className="font-semibold text-lg text-green-800">{ch.nom}</div>
            {ch.vehicule_id ? (
              <div className="text-sm text-gray-700">
                Véhicule assigné:{" "}
                <span className="font-medium text-green-700">
                  {ch.marque} {ch.modele} ({ch.matricule})
                </span>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                Aucun véhicule assigné
              </div>
            )}
            {Array.isArray(ch.collectes) && ch.collectes.length > 0 ? (
              <div className="mt-2">
                <div className="font-semibold text-green-700 mb-1 text-sm">
                  Collectes affectées :
                </div>
                <ul className="list-disc ml-5 space-y-1">
                  {ch.collectes.map((col) => (
                    <li key={col.id} className="text-xs text-gray-700">
                      {col.type_dechet} -{" "}
                      {new Date(col.date_souhaitee).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "2-digit",
                          month: "long",
                        }
                      )}{" "}
                      à {col.heure_preferee} ({col.statut})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-xs text-gray-400 mt-2">
                Aucune collecte affectée
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ChauffeursList;
