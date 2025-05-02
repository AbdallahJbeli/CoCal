import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";

const adminTabs = [
  "Vue d'ensemble",
  "Collectes",
  "Clients",
  "Chauffeurs",
  "Carte",
  "Historique",
  "Messages",
];

const CommercialPage = () => {
  const [activeTab, setActiveTab] = useState("Vue d'ensemble");
  const [demandes, setDemandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCollectes, setSelectedCollectes] = useState([]);
  const [showCollectesModal, setShowCollectesModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "Vue d'ensemble":
        return "Tableau de bord";
      case "Collectes":
        return "Gestion des collectes";
      case "Clients":
        return "Clients";
      case "Chauffeurs":
        return "Chauffeurs";
      case "Carte":
        return "Carte";
      case "Historique":
        return "Historique";
      case "Messsages":
        return "Messsages";
      default:
        return "Admin Dashboard";
    }
  };

  // Fetch demandes when "Collectes" tab is active
  useEffect(() => {
    if (activeTab === "Collectes") {
      const fetchDemandes = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:5000/commercial/demandes", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();

            setDemandes(data);
          } else {
            setDemandes([]);
          }
        } catch {
          setDemandes([]);
        }
        setLoading(false);
      };
      fetchDemandes();
    }
  }, [activeTab]);

  // Fetch clients when "Clients" tab is active
  useEffect(() => {
    if (activeTab === "Clients") {
      const fetchClients = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:5000/commercial/clients", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setClients(data);
          } else {
            setClients([]);
          }
        } catch {
          setClients([]);
        }
        setLoading(false);
      };
      fetchClients();
    }
  }, [activeTab]);

  const fetchCollectesForClient = async (clientId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5000/commercial/clients/${clientId}/collectes`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setSelectedCollectes(data);
    setShowCollectesModal(true);
    setSelectedClient(clients.find((c) => c.id === clientId));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar tabs={adminTabs} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col ml-16 md:ml-64">
        <div className="fixed top-0 left-16 md:left-64 right-0 h-20 px-6 bg-gray-200 border-b border-green-500 shadow-sm flex items-center justify-between z-10">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
            {getHeaderTitle()}
          </h1>
        </div>

        <div className="flex-1 p-6 mt-20 overflow-y-auto bg-gray-50">
          {activeTab === "Vue d'ensemble" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Dashboard Content
              </h2>
              <p className="text-gray-600">Your dashboard content goes here.</p>
            </div>
          )}
          {activeTab === "Collectes" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Mes Collectes Assignées
              </h2>
              {loading ? (
                <p className="text-gray-600">Chargement...</p>
              ) : demandes.length === 0 ? (
                <p className="text-gray-600">Aucune collecte trouvée.</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {demandes.map((d) => (
                    <li
                      key={d.id}
                      className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${
                      d.statut === "en_attente"
                        ? "bg-yellow-100 text-yellow-800"
                        : d.statut === "en_cours"
                        ? "bg-blue-100 text-blue-800"
                        : d.statut === "terminee"
                        ? "bg-green-100 text-green-800"
                        : d.statut === "annulee"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                          >
                            {d.statut}
                          </span>
                          {/* Dropdown to change status */}
                          <select
                            value={d.statut}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              const token = localStorage.getItem("token");
                              await fetch(
                                `http://localhost:5000/commercial/demandes/${d.id}/statut`,
                                {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({ statut: newStatus }),
                                }
                              );
                              // Refresh demandes after update
                              const res = await fetch(
                                "http://localhost:5000/commercial/demandes",
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              if (res.ok) {
                                const data = await res.json();
                                setDemandes(data);
                              }
                            }}
                            className="ml-2 border rounded px-2 py-1"
                          >
                            <option value="en_attente">En attente</option>
                            <option value="en_cours">En cours</option>
                            <option value="terminee">Terminée</option>
                            <option value="annulee">Annulée</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <p className="flex items-center gap-2">
                            <span className="font-medium">{d.type_dechet}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            {new Date(d.date_souhaitee).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "2-digit",
                                month: "long",
                              }
                            )}{" "}
                            à {d.heure_preferee}
                          </p>
                          <p className="flex items-center gap-2">
                            {d.quantite_estimee} kg
                          </p>
                        </div>

                        {d.notes_supplementaires && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              {d.notes_supplementaires}
                            </p>
                          </div>
                        )}

                        {d.latitude && d.longitude && (
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${d.latitude}&mlon=${d.longitude}#map=18/${d.latitude}/${d.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-green-700 hover:underline mt-2"
                          >
                            Voir la localisation
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {activeTab === "Clients" && (
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
                      <th className="px-4 py-2 text-left">
                        Nombre de Collectes
                      </th>
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
                            onClick={() => fetchCollectesForClient(client.id)}
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
                        onClick={() => setShowCollectesModal(false)}
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
                                {new Date(col.date_creation).toLocaleDateString(
                                  "fr-FR"
                                )}
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
                                <span className="font-medium">
                                  {col.type_dechet}
                                </span>
                              </p>
                              <p>
                                {new Date(
                                  col.date_souhaitee
                                ).toLocaleDateString("fr-FR", {
                                  day: "2-digit",
                                  month: "long",
                                })}{" "}
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
          )}
          {activeTab === "Chauffeurs" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Chauffeurs Content
              </h2>
              <p className="text-gray-600">
                Your Chauffeurs content goes here.
              </p>
            </div>
          )}
          {activeTab === "Carte" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Carte Content
              </h2>
              <p className="text-gray-600">Your Carte content goes here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommercialPage;
