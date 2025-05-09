import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import UsersTab from "../components/UsersTab";
import { useNavigate } from "react-router-dom";

const adminTabs = [
  "Vue d'ensemble",
  "Utilisateurs",
  "Collectes",
  "Véhicules",
  "Analytics",
];

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("Vue d'ensemble");

  const fetchUsers = async () => {
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
    fetchUsers();
  }, [navigate]);

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "Vue d'ensemble":
        return "Tableau de bord";
      case "Utilisateurs":
        return "Gestion des utilisateurs";
      case "Collectes":
        return "Gestion des collectes";
      case "Véhicules":
        return "Gestion des véhicules";
      case "Analytics":
        return "Analytics";
      default:
        return "Admin Dashboard";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar tabs={adminTabs} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col ml-16 md:ml-64">
        <div className="fixed top-0 left-16 md:left-64 right-0 h-20 px-6 bg-white/95 border-b border-gray-200 shadow-sm flex items-center justify-between z-10">
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
            <UsersTab users={users} onUserAdded={fetchUsers} />
          )}
          {activeTab === "Collectes" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Collectes Content
              </h2>
              <p className="text-gray-600">Your collectes content goes here.</p>
            </div>
          )}
          {activeTab === "Véhicules" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Véhicules Content
              </h2>
              <p className="text-gray-600">Your véhicules content goes here.</p>
            </div>
          )}
          {activeTab === "Analytics" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Analytics Content
              </h2>
              <p className="text-gray-600">Your analytics content goes here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
