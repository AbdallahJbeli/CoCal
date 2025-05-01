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
  const [loading, setLoading] = useState(false);

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
                <table className="min-w-full bg-white rounded-xl shadow overflow-hidden">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Date souhaitée</th>
                      <th className="px-4 py-2 text-left">Heure</th>
                      <th className="px-4 py-2 text-left">Quantité</th>
                      <th className="px-4 py-2 text-left">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demandes.map((d) => (
                      <tr key={d.id}>
                        <td className="px-4 py-2">{d.type_dechet}</td>
                        <td className="px-4 py-2">
                          {new Date(d.date_souhaitee).toLocaleDateString(
                            "fr-FR"
                          )}
                        </td>
                        <td className="px-4 py-2">{d.heure_preferee}</td>
                        <td className="px-4 py-2">{d.quantite_estimee} kg</td>
                        <td className="px-4 py-2">{d.statut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {activeTab === "Clients" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Clients Content
              </h2>
              <p className="text-gray-600">Your clients content goes here.</p>
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
