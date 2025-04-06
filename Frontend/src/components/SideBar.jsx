import React from "react";
import { Coffee, Home, Settings, Users, BarChart, LogOut } from "lucide-react";

const Sidebar = ({ setActiveTab }) => {
  return (
    <div className="w-64 h-screen bg-gray-200 text-gray-800 flex flex-col shadow-lg border-r border-green-500">
      <div className="flex items-center justify-center h-20 bg-gray-200 border-b border-green-500">
        <Coffee className="mr-3 h-8 w-8 text-brown-600" />
        <h1 className="text-xl font-bold text-gray-800 tracking-wider">
          CoCal Admin
        </h1>
      </div>

      <nav className="flex-1 mt-6 overflow-y-auto">
        <ul className="space-y-1 px-4">
          <li>
            <button
              onClick={() => setActiveTab("Vue d'ensemble")}
              className="flex items-center w-full p-3 rounded-md hover:bg-green-200 transition-colors text-gray-700 font-medium cursor-pointer"
            >
              <Home size={20} className="mr-3" />
              Vue d'ensemble
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("Utilisateurs")}
              className="flex items-center w-full p-3 rounded-md hover:bg-green-200 transition-colors text-gray-700 font-medium cursor-pointer"
            >
              <Users size={20} className="mr-3" />
              Utilisateurs
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("analytics")}
              className="flex items-center w-full p-3 rounded-md hover:bg-green-200 transition-colors text-gray-700 font-medium cursor-pointer"
            >
              <BarChart size={20} className="mr-3" />
              Analytics
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("settings")}
              className="flex items-center w-full p-3 rounded-md hover:bg-green-200 transition-colors text-gray-700 font-medium cursor-pointer"
            >
              <Settings size={20} className="mr-3" />
              Settings
            </button>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-green-500">
        <button className="flex items-center w-full p-3 rounded-md hover:bg-red-200 hover:text-red-600 transition-colors text-gray-700 font-medium cursor-pointer">
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
