import React from "react";
import { Loader2, Pencil, UserPlus } from "lucide-react";

const UserForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  editingUser,
  commercialUsers,
  setFormData, // Add this prop
  setEditingUser, // Add this prop
}) => {
  return (
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
            }}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;
