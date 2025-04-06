import React, { useState } from "react";
import Sidebar from "../components/SideBar";

const Adminpage = () => {
  const [activeTab, setActiveTab] = useState("Vue d'ensemble");

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "Vue d'ensemble":
        return "Tableau de bord";
      case "Utilisateurs":
        return "Gestion des utilisateurs";
      case "analytics":
        return "Analytics";
      case "settings":
        return "Settings";
      default:
        return "Admin Dashboard";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between h-20 px-6 bg-gray-200 border-b border-green-500 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
            {getHeaderTitle()}
          </h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {activeTab === "Vue d'ensemble" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Dashboard Content
              </h2>
              <p className="text-gray-600">Your dashboard content goes here.</p>
            </div>
          )}
          {activeTab === "Utilisateurs" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Users Content
              </h2>
              <p className="text-gray-600">Your users content goes here.</p>
            </div>
          )}
          {activeTab === "analytics" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Analytics Content
              </h2>
              <p className="text-gray-600">Your analytics content goes here.</p>
            </div>
          )}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Settings Content
              </h2>
              <p className="text-gray-600">Your settings content goes here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Adminpage;
