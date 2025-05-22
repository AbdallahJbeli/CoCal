import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import ChauffeurCollectesList from "../components/ChauffeurCollectesList";
import ChauffeurDashboard from "../components/ChauffeurDashboard";
import ChauffeurMessages from "../components/ChauffeurMessages";

const chauffeurTabs = [
  "Vue d'ensemble",
  "Collectes assignées",
  "Historique",
  "Messages",
];

const ChauffeurPage = () => {
  const [activeTab, setActiveTab] = useState("Vue d'ensemble");

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "Vue d'ensemble":
        return "Tableau de bord";
      case "Collectes assignées":
        return "Collectes assignées";
      case "Historique":
        return "Historique des collectes";
      case "Messages":
        return "Messages";
      default:
        return "Espace Chauffeur";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar tabs={chauffeurTabs} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col ml-16 md:ml-64">
        <div className="fixed top-0 left-16 md:left-64 right-0 h-20 px-6 bg-gray-200 border-b border-green-500 shadow-sm flex items-center justify-between z-10">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
            {getHeaderTitle()}
          </h1>
        </div>

        <div className="flex-1 p-6 mt-20 overflow-y-auto bg-gray-50">
          {activeTab === "Vue d'ensemble" && <ChauffeurDashboard />}
          {activeTab === "Collectes assignées" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Mon Planning
              </h2>
              <ChauffeurCollectesList />
            </div>
          )}
          {activeTab === "Historique" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Historique des Collectes
              </h2>
              <p className="text-gray-600">
                Historique des collectes effectuées.
              </p>
            </div>
          )}
          {activeTab === "Messages" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Messages
              </h2>
              <ChauffeurMessages />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChauffeurPage;
