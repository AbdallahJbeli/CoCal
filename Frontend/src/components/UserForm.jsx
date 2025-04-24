import React, { useState } from "react";
import {
  Loader2,
  Pencil,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  options = null,
  formData,
  handleFieldChange,
  handleBlur,
  touched,
  errors,
  showPassword,
  setShowPassword,
}) => {
  const isSelect = type === "select";
  const showError = touched[name] && errors[name];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {formData.typeUtilisateur === "Client" &&
          ["num_telephone", "type_client", "id_commercial"].includes(name) && (
            <span className="text-red-500 ml-1">*</span>
          )}
      </label>
      <div className="relative">
        {isSelect ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-lg transition-all ${
              showError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-green-500 focus:border-green-500"
            }`}
          >
            <option value="">{placeholder}</option>
            {options}
          </select>
        ) : (
          <>
            <input
              name={name}
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg transition-all ${
                showError
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-green-500 focus:border-green-500"
              }`}
            />
            {type === "password" && formData[name] && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
          </>
        )}
      </div>
      {showError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );
};

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

  // Validation rules
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

  // Validate form on submit
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle field change with validation
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    handleChange(e);
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Handle form submission with validation
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (validateForm()) {
      handleSubmit(e);
    }
  };

  // Reset form
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
            !editingUser ? "*" : "(laisser vide si inchangé)"
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

        <FormInput
          label="Type d'utilisateur"
          name="typeUtilisateur"
          type="select"
          placeholder="Sélectionnez un type"
          options={
            <>
              <option value="Client">Client</option>
              <option value="Commercial">Commercial</option>
              <option value="Chauffeur">Chauffeur</option>
            </>
          }
          formData={formData}
          handleFieldChange={handleFieldChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
        />

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

            <FormInput
              label="Type de client"
              name="type_client"
              type="select"
              placeholder="Sélectionnez un type"
              options={
                <>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Café">Café</option>
                  <option value="Café-restaut">Café-restaut</option>
                </>
              }
              formData={formData}
              handleFieldChange={handleFieldChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
            />

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
          <FormInput
            label="Disponibilité"
            name="disponible"
            type="select"
            placeholder="Sélectionnez la disponibilité"
            options={
              <>
                <option value={1}>Disponible</option>
                <option value={0}>Non disponible</option>
              </>
            }
            formData={formData}
            handleFieldChange={handleFieldChange}
            handleBlur={handleBlur}
            touched={touched}
            errors={errors}
          />
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
