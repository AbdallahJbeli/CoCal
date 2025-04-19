import React, { useState } from "react";
import { Loader2, Pencil, Trash2, UserPlus, AlertCircle } from "lucide-react";

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

  const filteredUsers = users.filter((user) => {
    if (filterType === "Tous") return true;
    return (
      user.typeUtilisateur.trim().toLowerCase() === filterType.toLowerCase()
    );
  });

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

        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                name="nom"
                type="text"
                placeholder="Entrez le nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Entrez l'email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                name="motDePasse"
                type="password"
                placeholder="Entrez le mot de passe"
                value={formData.motDePasse}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'utilisateur
              </label>
              <select
                name="typeUtilisateur"
                value={formData.typeUtilisateur}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              >
                <option value="">Sélectionnez un type</option>
                <option value="Client">Client</option>
                <option value="Commercial">Commercial</option>
                <option value="Chauffeur">Chauffeur</option>
              </select>
            </div>

            {formData.typeUtilisateur === "Client" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone
                  </label>
                  <input
                    name="num_telephone"
                    type="text"
                    placeholder="Entrez le numéro"
                    value={formData.num_telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    name="adresse"
                    type="text"
                    placeholder="Entrez l'adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de client
                  </label>
                  <select
                    name="type_client"
                    value={formData.type_client}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Café">Café</option>
                    <option value="Café-restaut">Café-restaut</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commercial assigné
                  </label>
                  <select
                    name="id_commercial"
                    value={formData.id_commercial}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  >
                    <option value="">Sélectionnez un commercial</option>
                    {commercialUsers.map((commercial) => (
                      <option key={commercial.id} value={commercial.id}>
                        {commercial.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : editingUser ? (
                <>
                  <Pencil className="h-5 w-5" />
                  Modifier
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Ajouter
                </>
              )}
            </button>

            {editingUser && (
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all"
                onClick={() => {
                  setEditingUser(null);
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
                }}
              >
                Annuler
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}
        </form>

        <div className="mt-8">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["ID", "Nom", "Email", "Type", "Actions"].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {user.nom}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {user.typeUtilisateur}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <button
                          className="text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        {user.typeUtilisateur.trim().toLowerCase() !==
                          "admin" && (
                          <button
                            className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-gray-100"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
