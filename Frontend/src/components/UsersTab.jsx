import React, { useState } from "react";
import UserForm from "./UserForm";
import UserTable from "./UserTable";

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
  });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = editingUser
        ? `http://localhost:5000/admin/users/${editingUser.id}`
        : "http://localhost:5000/admin/create-user";
      const method = editingUser ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la soumission");
      }
      setFormData({
        nom: "",
        email: "",
        motDePasse: "",
        typeUtilisateur: "",
        num_telephone: "",
        adresse: "",
        type_client: "",
        id_commercial: "",
      });
      setEditingUser(null);
      if (onUserAdded) onUserAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      email: user.email,
      motDePasse: "",
      typeUtilisateur: user.typeUtilisateur,
      num_telephone: user.num_telephone,
      adresse: user.adresse,
      type_client: user.type_client,
      id_commercial: user.id_commercial || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer cet utilisateur ?");
    if (!confirmed) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
      }
      if (onUserAdded) onUserAdded();
    } catch (err) {
      alert(err.message);
    }
  };

  const commercialUsers = users.filter(
    (user) => user.typeUtilisateur.trim().toLowerCase() === "commercial"
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </h2>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Filtrer par type:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-44"
            >
              <option value="Tous">Tous</option>
              <option value="Client">Client</option>
              <option value="Commercial">Commercial</option>
              <option value="Chauffeur">Chauffeur</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <UserForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          editingUser={editingUser}
          commercialUsers={commercialUsers}
          setFormData={setFormData}
          setEditingUser={setEditingUser}
        />

        <UserTable
          users={users}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          filterType={filterType}
        />
      </div>
    </div>
  );
};

export default UsersTab;
