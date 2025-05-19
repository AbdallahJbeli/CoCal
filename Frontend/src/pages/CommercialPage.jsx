import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import CollectesList from "../components/CollectesList";
import ClientsList from "../components/ClientsList";
import CommercialDashboard from "../components/CommercialDashboard";
import ChauffeursList from "../components/ChauffeursList";
import CommercialMessages from "../components/CommercialMessages";

const commercialTabs = [
  "Vue d'ensemble",
  "Collectes",
  "Clients",
  "Chauffeurs",
  "Carte",
  "Historique",
  "Message",
];

const CommercialPage = () => {
  const [activeTab, setActiveTab] = useState("Vue d'ensemble");
  const [demandes, setDemandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
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
      case "Message":
        return "Message";
      default:
        return "Admin Dashboard";
    }
  };

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

  useEffect(() => {
    if (activeTab === "Chauffeurs") {
      const fetchChauffeurs = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            "http://localhost:5000/commercial/chauffeurs",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            setChauffeurs(data);
          } else {
            setChauffeurs([]);
          }
        } catch {
          setChauffeurs([]);
        }
        setLoading(false);
      };
      fetchChauffeurs();
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

  const handleStatusChange = async (demandeId, newStatus) => {
    const token = localStorage.getItem("token");
    await fetch(
      `http://localhost:5000/commercial/demandes/${demandeId}/statut`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statut: newStatus }),
      }
    );
    const res = await fetch("http://localhost:5000/commercial/demandes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setDemandes(data);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar tabs={commercialTabs} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col ml-16 md:ml-64">
        <div className="fixed top-0 left-16 md:left-64 right-0 h-20 px-6 bg-gray-200 border-b border-green-500 shadow-sm flex items-center justify-between z-10">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
            {getHeaderTitle()}
          </h1>
        </div>

        <div className="flex-1 p-6 mt-20 overflow-y-auto bg-gray-50">
          {activeTab === "Vue d'ensemble" && (
            <div>
              <CommercialDashboard />
            </div>
          )}
          {activeTab === "Collectes" && (
            <CollectesList
              demandes={demandes}
              loading={loading}
              onStatusChange={handleStatusChange}
            />
          )}
          {activeTab === "Clients" && (
            <ClientsList
              clients={clients}
              loading={loading}
              onShowCollectes={fetchCollectesForClient}
              showCollectesModal={showCollectesModal}
              selectedCollectes={selectedCollectes}
              selectedClient={selectedClient}
              onCloseCollectesModal={() => setShowCollectesModal(false)}
            />
          )}
          {activeTab === "Chauffeurs" && (
            <ChauffeursList chauffeurs={chauffeurs} loading={loading} />
          )}
          {activeTab === "Carte" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Carte Content
              </h2>
              <p className="text-gray-600">Your Carte content goes here.</p>
            </div>
          )}
          {activeTab === "Historique" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Historique Content
              </h2>
              <p className="text-gray-600">Your Historique content goes here.</p>
            </div>
          )}
          {activeTab === "Message" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Problèmes signalés
              </h2>
              <CommercialMessages />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommercialPage;
