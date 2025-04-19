import React from "react";
import {
  Coffee,
  Home,
  BarChart,
  Users,
  Truck,
  LogOut,
  Boxes,
  MessageCircle,
  Locate,
  Notebook,
  Plus,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const iconMap = {
  "Vue d'ensemble": <Home className="h-5 w-5 md:mr-3" />,
  Utilisateurs: <Users className="h-5 w-5 md:mr-3" />,
  Clients: <Users className="h-5 w-5 md:mr-3" />,
  Chauffeurs: <Users className="h-5 w-5 md:mr-3" />,
  Carte: <Locate className="h-5 w-5 md:mr-3" />,
  Collectes: <Boxes className="h-5 w-5 md:mr-3" />,
  "Demande Collectes": <Plus className="h-5 w-5 md:mr-3" />,
  Véhicules: <Truck className="h-5 w-5 md:mr-3" />,
  Historique: <Notebook className="h-5 w-5 md:mr-3" />,
  Analytics: <BarChart className="h-5 w-5 md:mr-3" />,
  Messages: <MessageCircle className="h-5 w-5 md:mr-3" />,
};

const Sidebar = ({ tabs, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isClientPage = location.pathname.includes("client");
  const isCommercialPage = location.pathname.includes("commercial");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="fixed w-16 md:w-64 h-screen bg-white/95 backdrop-blur-sm border-r border-gray-200 flex flex-col shadow-xl transition-all duration-300 z-50">
      {/* Logo Header */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <Coffee className="h-8 w-8 text-amber-600" />
          <span className="hidden md:block text-lg font-semibold text-gray-800">
            {isClientPage
              ? "CoCal Client"
              : isCommercialPage
              ? "CoCal Commercial"
              : "CoCal Admin"}
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-6 md:px-4">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className="w-full flex items-center justify-center md:justify-start p-3 rounded-lg
                         hover:bg-green-50 hover:text-green-700 
                         focus:outline-none focus:ring-2 focus:ring-green-200
                         transition-all duration-200 group"
              >
                <span className="text-gray-500 group-hover:text-green-600">
                  {iconMap[tab] || <Home className="h-5 w-5 md:mr-3" />}
                </span>
                <span className="hidden md:block ml-2 text-sm font-medium text-gray-600 group-hover:text-green-700">
                  {tab}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-2 md:p-4 border-t border-gray-200 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center md:justify-start p-3 rounded-lg
                   hover:bg-red-50 hover:text-red-700
                   focus:outline-none focus:ring-2 focus:ring-red-200
                   transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 text-gray-500 group-hover:text-red-600" />
          <span className="hidden md:block ml-2 text-sm font-medium text-gray-600 group-hover:text-red-700">
            Déconnexion
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
