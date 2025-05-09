import React, { useState } from "react";
import {
  Loader2,
  Pencil,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Briefcase,
  Truck,
  Shield,
  Coffee,
  Egg,
  CheckCircle,
  XCircle,
} from "lucide-react";
import FormInput from "./FormInput";

const UserForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  editingUser,
  commercialUsers,
  setFormData,
  setEditingUser,
}) => {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "nom":
        return !value.trim()
          ? "Le nom est requis"
          : value.length < 2
          ? "Le nom doit contenir au moins 2 caractères"
          : "";

      case "email":
        return !value.trim()
          ? "L'email est requis"
          : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
          ? "Format d'email invalide"
          : "";

      case "motDePasse":
        if (!editingUser && !value) return "Le mot de passe est requis";
        if (value && value.length < 6)
          return "Le mot de passe doit contenir au moins 6 caractères";
        if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          return "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre";
        return "";

      case "typeUtilisateur":
        return !value ? "Le type d'utilisateur est requis" : "";

      case "num_telephone":
        if (formData.typeUtilisateur === "Client" && !value)
          return "Le numéro de téléphone est requis";
        if (value && !/^[0-9+\s-]{8,}$/.test(value))
          return "Format de numéro invalide";
        return "";

      case "adresse":
        if (formData.typeUtilisateur === "Client" && !value)
          return "L'adresse est requis";
        return "";

      case "type_client":
        return formData.typeUtilisateur === "Client" && !value
          ? "Le type de client est requis"
          : "";

      case "id_commercial":
        return formData.typeUtilisateur === "Client" && !value
          ? "Le commercial assigné est requis"
          : "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    handleChange(e);
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (validateForm()) {
      handleSubmit(e);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      email: "",
      motDePasse: "",
      typeUtilisateur: "",
      num_telephone: "",
      adresse: "",
      type_client: "",
      id_commercial: "",
      disponible: "",
    });
    setEditingUser(null);
    setErrors({});
    setTouched({});
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Nom"
          name="nom"
          placeholder="Entrez le nom"
          formData={formData}
          handleFieldChange={handleFieldChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="Entrez l'email"
          formData={formData}
          handleFieldChange={handleFieldChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
        />

        <FormInput
          label={`Mot de passe ${
            !editingUser ? "" : "(laisser vide si inchangé)"
          }`}
          name="motDePasse"
          type="password"
          placeholder="Entrez le mot de passe"
          formData={formData}
          handleFieldChange={handleFieldChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'utilisateur <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex gap-6">
            {[
              {
                type: "Admin",
                icon: <Shield className="h-5 w-5 text-purple-600" />,
              },
              {
                type: "Client",
                icon: <User className="h-5 w-5 text-green-600" />,
              },
              {
                type: "Commercial",
                icon: <Briefcase className="h-5 w-5 text-blue-600" />,
              },
              {
                type: "Chauffeur",
                icon: <Truck className="h-5 w-5 text-yellow-600" />,
              },
            ].map(({ type, icon }) => (
              <label
                key={type}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all
                  ${
                    formData.typeUtilisateur === type
                      ? "border-green-600 bg-green-50 shadow"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }
                  `}
              >
                <input
                  type="radio"
                  name="typeUtilisateur"
                  value={type}
                  checked={formData.typeUtilisateur === type}
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  className="accent-green-600"
                />
                {icon}
                <span className="font-medium">{type}</span>
              </label>
            ))}
          </div>
          {touched.typeUtilisateur && errors.typeUtilisateur && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.typeUtilisateur}
            </p>
          )}
        </div>

        {formData.typeUtilisateur === "Client" && (
          <>
            <FormInput
              label="Numéro de téléphone"
              name="num_telephone"
              placeholder="Entrez le numéro"
              formData={formData}
              handleFieldChange={handleFieldChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
            />

            <FormInput
              label="Adresse"
              name="adresse"
              placeholder="Entrez l'adresse"
              formData={formData}
              handleFieldChange={handleFieldChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de client <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex gap-6">
                {[
                  {
                    type: "Restaurant",
                    icon: <Egg className="h-5 w-5 text-orange-600" />,
                  },
                  {
                    type: "Café",
                    icon: <Coffee className="h-5 w-5 text-brown-600" />,
                  },
                  {
                    type: "Café-restaut",
                    icon: (
                      <span className="flex items-center">
                        <Egg className="h-5 w-5 text-orange-600" />
                        <Coffee className="h-5 w-5 text-brown-600 ml-1" />
                      </span>
                    ),
                  },
                ].map(({ type, icon }) => (
                  <label
                    key={type}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all
                      ${
                        formData.type_client === type
                          ? "border-green-600 bg-green-50 shadow"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="type_client"
                      value={type}
                      checked={formData.type_client === type}
                      onChange={handleFieldChange}
                      onBlur={handleBlur}
                      className="accent-green-600"
                    />
                    {icon}
                    <span className="font-medium">{type}</span>
                  </label>
                ))}
              </div>
              {touched.type_client && errors.type_client && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.type_client}
                </p>
              )}
            </div>

            <FormInput
              label="Commercial assigné"
              name="id_commercial"
              type="select"
              placeholder="Sélectionnez un commercial"
              options={commercialUsers.map((commercial) => (
                <option key={commercial.id} value={commercial.id}>
                  {commercial.nom}
                </option>
              ))}
              formData={formData}
              handleFieldChange={handleFieldChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
            />
          </>
        )}

        {formData.typeUtilisateur === "Chauffeur" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disponibilité <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-6">
              {[
                {
                  value: 1,
                  label: "Disponible",
                  icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                },
                {
                  value: 0,
                  label: "Non disponible",
                  icon: <XCircle className="h-5 w-5 text-red-600" />,
                },
              ].map(({ value, label, icon }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all
                    ${
                      String(formData.disponible) === String(value)
                        ? "border-green-600 bg-green-50 shadow"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="radio"
                    name="disponible"
                    value={value}
                    checked={String(formData.disponible) === String(value)}
                    onChange={handleFieldChange}
                    onBlur={handleBlur}
                    className="accent-green-600"
                  />
                  {icon}
                  <span className="font-medium">{label}</span>
                </label>
              ))}
            </div>
            {touched.disponible && errors.disponible && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.disponible}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {editingUser ? "Modification..." : "Ajout..."}
            </>
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
            onClick={resetForm}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;
