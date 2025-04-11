import React from "react";
import { Coffee, Home, Settings, Users, BarChart, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className="fixed w-16 md:w-64 h-screen bg-gray-200 text-gray-800 flex flex-col shadow-lg border-r border-green-500 transition-all duration-300 z-10"
      style={{ top: 0, left: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-center h-20 bg-gray-200 border-b border-green-500">
        <Coffee className="md:mr-3 h-8 w-8 text-brown-600" />
        <h1 className="hidden md:block text-xl font-bold text-gray-800 tracking-wider">
          CoCal Admin
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-6 overflow-y-auto">
        <ul className="space-y-1 px-2 md:px-4">
          <li>
            <button
              onClick={() => setActiveTab("Vue d'ensemble")}
              className="flex items-center justify-center md:justify-start w-full p-3 rounded-md hover:bg-green-200 transition-colors text-gray-700 font-medium cursor-pointer"
            >
              <Home size={20} className="md:mr-3" />
              <span className="hidden md:inline">Vue d'ensemble</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("Utilisateurs")}
              className="flex items-center justify-center md:justify-start w-full p-3 rounded-md hover:bg-green-200 transition-colors text-gray-700 font-medium cursor-pointer"
            >
              <Users size={20} className="md:mr-3" />
              <span className="hidden md:inline">Utilisateurs</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("analytics")}
              className="flex items-center justify-center md:justify-start w-full p-3 rounded-md hover:bg-green-200 transition-colors text-gray-700 font-medium cursor-pointer"
            >
              <BarChart size={20} className="md:mr-3" />
              <span className="hidden md:inline">Collectes</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("settings")}
              className="flex items-center justify-center md:justify-start w-full p-3 rounded-md hover:bg-green-200 transition-colors text-gray-700 font-medium cursor-pointer"
            >
              <Settings size={20} className="md:mr-3" />
              <span className="hidden md:inline">Settings</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-2 md:p-4 border-t border-green-500">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start w-full p-3 rounded-md hover:bg-red-200 hover:text-red-600 transition-colors text-gray-700 font-medium cursor-pointer"
        >
          <LogOut size={20} className="md:mr-3" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
