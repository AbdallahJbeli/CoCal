import React from "react";

const ClientsList = ({
  clients,
  loading,
  onShowCollectes,
  showCollectesModal,
  selectedCollectes,
  selectedClient,
  onCloseCollectesModal,
}) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Mes Clients Assignés
    </h2>
    {loading ? (
      <p className="text-gray-600">Chargement...</p>
    ) : clients.length === 0 ? (
      <p className="text-gray-600">Aucun client trouvé.</p>
    ) : (
      <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Nom</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Téléphone</th>
            <th className="px-4 py-2 text-left">Adresse</th>
            <th className="px-4 py-2 text-left">Type Client</th>
            <th className="px-4 py-2 text-left">Nombre de Collectes</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="px-4 py-2">{client.nom}</td>
              <td className="px-4 py-2">{client.email}</td>
              <td className="px-4 py-2">{client.num_telephone}</td>
              <td className="px-4 py-2">{client.adresse}</td>
              <td className="px-4 py-2">{client.type_client}</td>
              <td className="px-4 py-2">{client.nombre_collectes}</td>
              <td className="px-4 py-2">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => onShowCollectes(client.id)}
                >
                  Voir les collectes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

    {/* Modal for displaying collectes */}
    {showCollectesModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">
              Collectes de {selectedClient?.nom}
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onCloseCollectesModal}
            >
              Fermer
            </button>
          </div>
          {selectedCollectes.length === 0 ? (
            <p className="text-gray-600">
              Aucune collecte trouvée pour ce client.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-4">
              {selectedCollectes.map((col) => (
                <li
                  key={col.id}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {new Date(col.date_creation).toLocaleDateString("fr-FR")}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${
                          col.statut === "en_attente"
                            ? "bg-yellow-100 text-yellow-800"
                            : col.statut === "en_cours"
                            ? "bg-blue-100 text-blue-800"
                            : col.statut === "terminee"
                            ? "bg-green-100 text-green-800"
                            : col.statut === "annulee"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {col.statut}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">{col.type_dechet}</span>
                    </p>
                    <p>
                      {new Date(col.date_souhaitee).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "2-digit",
                          month: "long",
                        }
                      )}{" "}
                      à {col.heure_preferee}
                    </p>
                    <p>{col.quantite_estimee} kg</p>
                  </div>
                  {col.notes_supplementaires && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {col.notes_supplementaires}
                      </p>
                    </div>
                  )}
                  {col.latitude && col.longitude && (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${col.latitude}&mlon=${col.longitude}#map=18/${col.latitude}/${col.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-green-700 hover:underline mt-2"
                    >
                      Voir la localisation
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )}
  </div>
);

export default ClientsList;
