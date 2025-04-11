import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import UsersTab from "../components/UsersTab";
import { useNavigate } from "react-router-dom";

const Adminpage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("Vue d'ensemble");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 403 || res.status === 401) {
        navigate("/login");
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

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
          {activeTab === "Utilisateurs" && (
            <UsersTab users={users} onUserAdded={fetchData} />
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
