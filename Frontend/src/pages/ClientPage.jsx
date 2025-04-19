import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import DemandeList from "../components/DemandeList";
import DemandeCollecteForm from "../components/DemandeCollecteTab";

const clientTabs = [
  "Vue d'ensemble",
  "Demande Collectes",
  "Collectes",
  "Historique",
  "Messages",
];

const ClientPage = () => {
  const [activeTab, setActiveTab] = useState("Vue d'ensemble");

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "Vue d'ensemble":
        return "Tableau de bord";
      case "Demande Collectes":
        return "Demande Collectes";
      case "Collectes":
        return "Gestion des collectes";
      case "Historique":
        return "Historique des collectes";
      case "Messages":
        return "Messages";
      default:
        return "Client Dashboard";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar tabs={clientTabs} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-16 md:ml-64">
        {/* Header Section */}
        <div className="fixed top-0 left-16 md:left-64 right-0 h-20 px-6 bg-white/95 border-b border-gray-200 shadow-sm flex items-center justify-between z-10">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
            {getHeaderTitle()}
          </h1>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 mt-20 overflow-y-auto bg-gray-50">
          {activeTab === "Vue d'ensemble" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Dashboard Content
              </h2>
              <p className="text-gray-600">Your dashboard content goes here.</p>
            </div>
          )}

          {activeTab === "Demande Collectes" && <DemandeCollecteForm />}

          {activeTab === "Collectes" && <DemandeList />}

          {activeTab === "Historique" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Historique
              </h2>
              <p className="text-gray-600">
                Historique des collectes à venir...
              </p>
            </div>
          )}

          {activeTab === "Messages" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Messages
              </h2>
              <p className="text-gray-600">Système de messagerie à intégrer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
