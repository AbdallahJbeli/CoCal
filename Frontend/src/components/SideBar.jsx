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
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const iconMap = {
  "Vue d'ensemble": <Home size={20} className="md:mr-3" />,
  Utilisateurs: <Users size={20} className="md:mr-3" />,
  Clients: <Users size={20} className="md:mr-3" />,
  Collectes: <Boxes size={20} className="md:mr-3" />,
  Véhicules: <Truck size={20} className="md:mr-3" />,
  Analytics: <BarChart size={20} className="md:mr-3" />,
  Messages: <MessageCircle size={20} className="md:mr-3" />,
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
    <div
      className="fixed w-16 md:w-64 h-screen bg-gray-200 text-gray-800 flex flex-col shadow-lg border-r border-green-500 transition-all duration-300 z-10"
      style={{ top: 0, left: 0 }}
    >
      <div className="flex items-center justify-center h-20 bg-gray-200 border-b border-green-500">
        <Coffee className="md:mr-3 h-8 w-8 text-brown-600" />
        <h1 className="hidden md:block text-xl font-bold text-gray-800 tracking-wider">
          {isClientPage
            ? "CoCal Client"
            : isCommercialPage
            ? "CoCal Commercial"
            : "CoCal Admin"}
        </h1>
      </div>

      <nav className="flex-1 mt-6 overflow-y-auto">
        <ul className="space-y-1 px-2 md:px-4">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className="flex items-center justify-center md:justify-start w-full p-3 rounded-md hover:bg-green-200 transition-colors text-gray-700 font-medium cursor-pointer"
              >
                {iconMap[tab] || <Home size={20} className="md:mr-3" />}
                <span className="hidden md:inline">{tab}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

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
