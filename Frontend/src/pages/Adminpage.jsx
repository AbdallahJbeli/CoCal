import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import UsersTab from "../components/Users/UsersTab";
import CollectesList from "../components/CollectesList";
import VehiculesTab from "../components/Vehicules/VehiculesTab";
import AnalyticsTab from "../components/AnalyticsTab";
import ChauffeursList from "../components/ChauffeursList";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "../components/Admin/AdminDashboard";
import AdminMessages from "../components/Admin/AdminMessages";

const adminTabs = [
  "Vue d'ensemble",
  "Utilisateurs",
  "Collectes",
  "Véhicules",
  "Chauffeurs",
  "Analytics",
  "Message",
];

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("Vue d'ensemble");
  const [collectes, setCollectes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);

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

  const fetchChauffeurs = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/admin/chauffeurs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setChauffeurs(data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des chauffeurs:", err);
    }
  };

  const fetchVehicules = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:5000/commercial/vehicules-disponibles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setVehicules(data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des véhicules:", err);
    }
  };

  const fetchCollectes = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/admin/collectes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 403 || res.status === 401) {
        navigate("/login");
        return;
      }
      const data = await res.json();
      setCollectes(data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur:", err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/admin/collectes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statut: newStatus }),
      });
      if (res.ok) {
        fetchCollectes();
      } else {
        const data = await res.json();
        console.error("Erreur lors du changement de statut:", data.message);
      }
    } catch (err) {
      console.error("Erreur lors du changement de statut:", err);
    }
  };

  const handleAffectation = async (id, id_chauffeur, id_vehicule) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/admin/collectes/${id}/affectation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_chauffeur, id_vehicule }),
        }
      );
      if (res.ok) {
        fetchCollectes();
        fetchChauffeurs();
        fetchVehicules();
      } else {
        const data = await res.json();
        console.error("Erreur lors de l'affectation:", data.message);
      }
    } catch (err) {
      console.error("Erreur lors de l'affectation:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCollectes();
    fetchChauffeurs();
    fetchVehicules();
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
      case "Chauffeurs":
        return "Gestion des chauffeurs";
      case "Analytics":
        return "Analytics";
      case "Message":
        return "Message";
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
              <AdminDashboard />
            </div>
          )}
          {activeTab === "Utilisateurs" && (
            <UsersTab users={users} onUserAdded={fetchUsers} />
          )}
          {activeTab === "Collectes" && (
            <div>
              <CollectesList
                demandes={collectes}
                loading={loading}
                onStatusChange={handleStatusChange}
                onAffectation={handleAffectation}
                chauffeurs={chauffeurs}
                vehicules={vehicules}
              />
            </div>
          )}
          {activeTab === "Chauffeurs" && (
            <ChauffeursList chauffeurs={chauffeurs} loading={loading} />
          )}
          {activeTab === "Véhicules" && <VehiculesTab />}
          {activeTab === "Analytics" && <AnalyticsTab />}
          {activeTab === "Message" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Messages
              </h2>
              <AdminMessages />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
