import React, { useState } from "react";

const UsersTab = ({ users, onUserAdded }) => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    typeUtilisateur: "",
    num_telephone: "",
    adresse: "",
    type_client: "",
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

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        {editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
      </h2>
      <div className="flex justify-end mb-4">
        <label className="block text-sm font-medium text-gray-700 mr-2">
          Filtrer par type:
        </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="Tous">Tous</option>
          <option value="Client">Client</option>
          <option value="Commercial">Commercial</option>
          <option value="Chauffeur">Chauffeur</option>
        </select>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              name="nom"
              type="text"
              placeholder="Entrez le nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Entrez l'email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              name="motDePasse"
              type="password"
              placeholder="Entrez le mot de passe"
              value={formData.motDePasse}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d'utilisateur
            </label>
            <select
              name="typeUtilisateur"
              value={formData.typeUtilisateur}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Sélectionnez un type</option>{" "}
              <option value="Client">Client</option>
              <option value="Commercial">Commercial</option>
              <option value="Chauffeur">Chauffeur</option>
            </select>
          </div>
          {formData.typeUtilisateur === "Client" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone
                </label>
                <input
                  name="num_telephone"
                  type="text"
                  placeholder="Entrez le numéro de téléphone"
                  value={formData.num_telephone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  name="adresse"
                  type="text"
                  placeholder="Entrez l'adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de client
                </label>
                <select
                  name="type_client"
                  value={formData.type_client}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="VIP">VIP</option>
                  <option value="Régulier">Régulier</option>
                  <option value="Occasionnel">Occasionnel</option>
                </select>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
          >
            {loading
              ? "En cours..."
              : editingUser
              ? "Modifier l'utilisateur"
              : "Ajouter un utilisateur"}
          </button>
          {editingUser && (
            <button
              type="button"
              className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-md hover:bg-gray-500 transition duration-300"
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
                });
              }}
            >
              Annuler
            </button>
          )}
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
      <div className="mt-8">
        {filteredUsers.length === 0 ? (
          <p className="text-gray-600 text-center py-4">
            Aucun utilisateur trouvé pour ce filtre.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  console.log(
                    `User ${user.nom} is an admin?`,
                    user.typeUtilisateur.trim().toLowerCase() === "admin"
                  );
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {user.id}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {user.nom}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {user.email}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {user.typeUtilisateur}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEdit(user)}
                        >
                          Modifier
                        </button>
                        {user.typeUtilisateur.trim().toLowerCase() !==
                          "admin" && (
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(user.id)}
                          >
                            Supprimer
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTab;
