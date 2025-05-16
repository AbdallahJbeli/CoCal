import React, { useState } from "react";
import {
  Loader2,
  Pencil,
  Truck,
  AlertCircle,
  Package,
  Car,
  Bike,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import FormInput from "./FormInput";

const VehiculeForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  editingVehicule,
  setFormData,
  setEditingVehicule,
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "matricule":
        return !value?.trim()
          ? "Le matricule est requis"
          : value.length < 3
          ? "Le matricule doit contenir au moins 3 caractères"
          : "";
      case "marque":
        return !value?.trim()
          ? "La marque est requise"
          : value.length < 2
          ? "La marque doit contenir au moins 2 caractères"
          : "";
      case "modele":
        return !value?.trim()
          ? "Le modèle est requis"
          : value.length < 2
          ? "Le modèle doit contenir au moins 2 caractères"
          : "";
      case "capacite_kg":
        return !value || value === ""
          ? "La capacité est requise"
          : isNaN(value)
          ? "La capacité doit être un nombre"
          : parseFloat(value) <= 0
          ? "La capacité doit être supérieure à 0"
          : "";
      case "etat":
        return !value ? "L'état est requis" : "";
      case "type_vehicule":
        return !value ? "Le type de véhicule est requis" : "";
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
      matricule: "",
      marque: "",
      modele: "",
      capacite_kg: "",
      etat: "",
      type_vehicule: "",
    });
    setEditingVehicule(null);
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
          label="Matricule"
          name="matricule"
          placeholder="Entrez le matricule"
          formData={formData}
          handleFieldChange={handleFieldChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
        />

        <FormInput
          label="Marque"
          name="marque"
          placeholder="Entrez la marque"
          formData={formData}
          handleFieldChange={handleFieldChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
        />

        <FormInput
          label="Modèle"
          name="modele"
          placeholder="Entrez le modèle"
          formData={formData}
          handleFieldChange={handleFieldChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
        />

        <FormInput
          label="Capacité (kg)"
          name="capacite_kg"
          type="number"
          placeholder="Entrez la capacité"
          formData={formData}
          handleFieldChange={handleFieldChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            État <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex gap-4">
            {[
              {
                value: "disponible",
                label: "Disponible",
                icon: <CheckCircle className="h-5 w-5 text-green-600" />,
              },
              {
                value: "en_maintenance",
                label: "En maintenance",
                icon: <Clock className="h-5 w-5 text-yellow-600" />,
              },
              {
                value: "en_mission",
                label: "En mission",
                icon: <Package className="h-5 w-5 text-blue-600" />,
              },
            ].map(({ value, label, icon }) => (
              <label
                key={value}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  formData.etat === value
                    ? "border-green-600 bg-green-50 shadow"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="etat"
                  value={value}
                  checked={formData.etat === value}
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  className="accent-green-600"
                />
                {icon}
                <span className="font-medium">{label}</span>
              </label>
            ))}
          </div>
          {touched.etat && errors.etat && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.etat}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de véhicule <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex gap-4">
            {[
              {
                value: "camionette",
                label: "Camionette",
                icon: <Car className="h-5 w-5 text-blue-600" />,
              },
              {
                value: "triporteur",
                label: "Triporteur",
                icon: <Bike className="h-5 w-5 text-green-600" />,
              },
              {
                value: "camion",
                label: "Camion",
                icon: <Truck className="h-5 w-5 text-purple-600" />,
              },
            ].map(({ value, label, icon }) => (
              <label
                key={value}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  formData.type_vehicule === value
                    ? "border-green-600 bg-green-50 shadow"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="type_vehicule"
                  value={value}
                  checked={formData.type_vehicule === value}
                  onChange={handleFieldChange}
                  onBlur={handleBlur}
                  className="accent-green-600"
                />
                {icon}
                <span className="font-medium">{label}</span>
              </label>
            ))}
          </div>
          {touched.type_vehicule && errors.type_vehicule && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.type_vehicule}
            </p>
          )}
        </div>
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
              {editingVehicule ? "Modification..." : "Ajout..."}
            </>
          ) : editingVehicule ? (
            <>
              <Pencil className="h-5 w-5" />
              Modifier
            </>
          ) : (
            <>
              <Truck className="h-5 w-5" />
              Ajouter
            </>
          )}
        </button>

        {editingVehicule && (
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

export default VehiculeForm;
