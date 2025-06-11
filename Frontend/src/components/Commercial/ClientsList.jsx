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
    <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-base">
        👥
      </span>
      Mes Clients Assignés
    </h2>
    {loading ? (
      <div className="flex justify-center items-center h-32">
        <span className="loader border-green-600"></span>
        <span className="ml-3 text-green-700 font-medium">Chargement...</span>
      </div>
    ) : clients.length === 0 ? (
      <div className="text-center py-10 text-gray-500 text-lg">
        Aucun client trouvé.
      </div>
    ) : (
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-white rounded-xl">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-green-800">
                Nom
              </th>
              <th className="px-4 py-3 text-left font-semibold text-green-800">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-green-800">
                Téléphone
              </th>
              <th className="px-4 py-3 text-left font-semibold text-green-800">
                Adresse
              </th>
              <th className="px-4 py-3 text-left font-semibold text-green-800">
                Type Client
              </th>
              <th className="px-4 py-3 text-left font-semibold text-green-800">
                Collectes
              </th>
              <th className="px-4 py-3 text-left font-semibold text-green-800">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, idx) => (
              <tr
                key={client.id}
                className={
                  (idx % 2 === 0 ? "bg-white" : "bg-green-50/50") +
                  " border-b border-green-100 " +
                  (idx !== clients.length - 1 ? " " : "")
                }
                style={{ height: "64px" }} // Add vertical space between rows
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {client.nom}
                </td>
                <td className="px-4 py-3 text-gray-700">{client.email}</td>
                <td className="px-4 py-3 text-gray-700">
                  {client.num_telephone}
                </td>
                <td className="px-4 py-3 text-gray-700">{client.adresse}</td>
                <td className="px-4 py-3 text-gray-700 capitalize">
                  {client.type_client}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    {client.nombre_collectes}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="px-4 py-1 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                    onClick={() => onShowCollectes(client.id)}
                  >
                    Voir les collectes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {showCollectesModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-2 border-green-200">
          <div className="flex justify-between items-center mb-6 border-b pb-2 border-green-100">
            <h3 className="text-xl font-bold text-green-800 flex items-center gap-2">
              <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-base">
                🗑️
              </span>
              Collectes de {selectedClient?.nom}
            </h3>
            <button
              className="text-gray-500 hover:text-green-700 text-lg font-bold px-3 py-1 rounded transition"
              onClick={onCloseCollectesModal}
              title="Fermer"
            >
              ✕
            </button>
          </div>
          {selectedCollectes.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-base">
              Aucune collecte trouvée pour ce client.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4">
              {selectedCollectes.map((col) => (
                <li
                  key={col.id}
                  className="border border-green-100 rounded-xl p-4 shadow-sm bg-green-50/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {new Date(col.date_creation).toLocaleDateString("fr-FR")}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
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
                      <span className="font-medium text-green-900">
                        {col.type_dechet}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      {new Date(col.date_souhaitee).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "2-digit",
                          month: "long",
                        }
                      )}{" "}
                      à {col.heure_preferee}
                    </p>
                    <p className="text-sm text-gray-700">
                      {col.quantite_estimee} kg
                    </p>
                  </div>
                  {col.notes_supplementaires && (
                    <div className="mt-2 p-3 bg-green-100/50 rounded-lg">
                      <p className="text-xs text-green-800">
                        {col.notes_supplementaires}
                      </p>
                    </div>
                  )}
                  {col.latitude && col.longitude && (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${col.latitude}&mlon=${col.longitude}#map=18/${col.latitude}/${col.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-green-700 hover:underline mt-2 text-xs"
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
