import React, { useState, useCallback, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import UserForm from "./UserForm";
import UserTable from "./UserTable";
import { toast } from "react-hot-toast";

const UsersTab = ({ users, onUserAdded }) => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    typeUtilisateur: "",
    num_telephone: "",
    adresse: "",
    type_client: "",
    id_commercial: "",
    disponible: 1,
  });

  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const [commercialUsers, setCommercialUsers] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCommercialUsers = async () => {
      try {
        const commercials = users.filter(
          (user) => user.typeUtilisateur.toLowerCase() === "commercial"
        );
        setCommercialUsers(commercials);
      } catch (err) {
        console.error("Erreur lors de la récupération des commerciaux:", err);
        toast.error("Erreur lors de la récupération des commerciaux");
      }
    };

    fetchCommercialUsers();
  }, [users]);

  const resetForm = useCallback(() => {
    setFormData({
      nom: "",
      email: "",
      motDePasse: "",
      typeUtilisateur: "",
      num_telephone: "",
      adresse: "",
      type_client: "",
      id_commercial: "",
      disponible: 1,
    });
    setEditingUser(null);
    setError("");
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = editingUser
        ? `http://localhost:5000/admin/users/${editingUser.id}`
        : "http://localhost:5000/admin/create-user";

      const method = editingUser ? "PUT" : "POST";

      const requestData = Object.fromEntries(
        Object.entries(formData).filter(([, value]) => value !== "")
      );

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      toast.success(
        editingUser
          ? "Utilisateur modifié avec succès"
          : "Utilisateur créé avec succès"
      );

      resetForm();
      if (onUserAdded) onUserAdded();
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la suppression");
      }

      toast.success("Utilisateur supprimé avec succès");
      if (onUserAdded) onUserAdded();
    } catch (err) {
      console.error("Erreur:", err);
      toast.error(err.message);
    }
  };

  const handleEdit = useCallback((user) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom || "",
      email: user.email || "",
      motDePasse: "",
      typeUtilisateur: user.typeUtilisateur
        ? user.typeUtilisateur.charAt(0).toUpperCase() +
          user.typeUtilisateur.slice(1).toLowerCase()
        : "",
      num_telephone: user.num_telephone || "",
      adresse: user.adresse || "",
      type_client: user.type_client || "",
      id_commercial: user.id_commercial || "",
      disponible: user.disponible ?? 1,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Filter Types */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {["Tous", "Client", "Commercial", "Chauffeur"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === type
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="text-red-700 hover:text-red-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* User Form */}
      <UserForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        editingUser={editingUser}
        commercialUsers={commercialUsers}
        setFormData={setFormData}
        setEditingUser={setEditingUser}
        resetForm={resetForm}
      />

      {/* User Table */}
      <UserTable
        users={users}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        filterType={filterType}
      />
    </div>
  );
};

export default UsersTab;
