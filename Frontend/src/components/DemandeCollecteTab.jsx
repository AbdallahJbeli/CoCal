import React, { useState, useEffect } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import FormInput from "./FormInput";

const options = [
  { value: "marcCafe", label: "Marc de café" },
  { value: "coquillesOeufs", label: "Coquilles d'œufs" },
  { value: "lesDeux", label: "Les deux" },
];

const DemandeCollecteTab = ({ editingDemande, onEditSuccess, mode }) => {
  const [formData, setFormData] = useState({
    typeDechet: "",
    dateSouhaitee: "",
    heurePreferee: "",
    quantiteEstimee: "",
    notesSupplementaires: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Prefill form when editingDemande changes
  useEffect(() => {
    if (editingDemande) {
      setFormData({
        typeDechet: editingDemande.type_dechet || "",
        dateSouhaitee: editingDemande.date_souhaitee
          ? editingDemande.date_souhaitee.slice(0, 10)
          : "",
        heurePreferee: editingDemande.heure_preferee || "",
        quantiteEstimee: editingDemande.quantite_estimee || "",
        notesSupplementaires: editingDemande.notes_supplementaires || "",
      });
    }
  }, [editingDemande]);

  const validateField = (name, value) => {
    switch (name) {
      case "typeDechet":
        return !value ? "Le type de déchet est requis" : "";
      case "dateSouhaitee":
        return !value ? "La date souhaitée est requise" : "";
      case "heurePreferee":
        return !value ? "L'heure préférée est requise" : "";
      case "quantiteEstimee":
        if (!value) return "La quantité estimée est requise";
        if (isNaN(value) || Number(value) <= 0)
          return "La quantité doit être un nombre positif";
        return "";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name]),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setTouched({
        typeDechet: true,
        dateSouhaitee: true,
        heurePreferee: true,
        quantiteEstimee: true,
        notesSupplementaires: true,
      });
      return;
    }

    const requestBody = {
      type_dechet: formData.typeDechet,
      date_souhaitee: formData.dateSouhaitee,
      heure_preferee: formData.heurePreferee,
      quantite_estimee: formData.quantiteEstimee,
      notes_supplementaires: formData.notesSupplementaires,
    };

    try {
      const token = localStorage.getItem("token");
      let res, data;
      if (mode === "edit" && editingDemande) {
        // PUT request for edit
        res = await fetch(
          `http://localhost:5000/client/demande-collecte/${editingDemande.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          }
        );
        data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Erreur lors de la modification.");
        alert("Demande modifiée avec succès !");
        if (onEditSuccess) onEditSuccess();
      } else {
        // POST request for new demande
        res = await fetch("http://localhost:5000/client/demande-collecte", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...requestBody,
            statut: "en_attente",
            date_creation: new Date().toISOString().split("T")[0],
          }),
        });
        data = await res.json();
        if (!res.ok)
          throw new Error(
            data.message || "Erreur lors de l'envoi de la demande."
          );
        alert("Demande envoyée avec succès !");
        setFormData({
          typeDechet: "",
          dateSouhaitee: "",
          heurePreferee: "",
          quantiteEstimee: "",
          notesSupplementaires: "",
        });
        setErrors({});
      }
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);
      alert(err.message || "Erreur lors de l'envoi de la demande.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-green-600" />
        {mode === "edit"
          ? "Modifier la demande"
          : "Nouvelle demande de collecte"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type de déchet (radio group, not FormInput) */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-gray-700 mb-2">
            Type de déchet *
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {options.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer
                  ${
                    formData.typeDechet === option.value
                      ? "border-green-500 bg-green-50 ring-2 ring-green-100"
                      : errors.typeDechet && touched.typeDechet
                      ? "border-red-500"
                      : "border-gray-200 hover:border-green-300"
                  }`}
              >
                <input
                  type="radio"
                  name="typeDechet"
                  value={option.value}
                  checked={formData.typeDechet === option.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
                <span className="ml-3 text-gray-700 font-medium">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          {errors.typeDechet && touched.typeDechet && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.typeDechet}
            </p>
          )}
        </fieldset>

        {/* Date souhaitée */}
        <FormInput
          label="Date souhaitée *"
          name="dateSouhaitee"
          type="date"
          placeholder=""
          formData={formData}
          handleFieldChange={handleChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
        />

        {/* Heure préférée */}
        <FormInput
          label="Heure préférée *"
          name="heurePreferee"
          type="select"
          placeholder="Sélectionnez une heure"
          options={[
            <option key="matin8_10" value="matin8_10">
              🕗 8h - 10h
            </option>,
            <option key="matin10_12" value="matin10_12">
              🕙 10h - 12h
            </option>,
            <option key="apresMidi14_16" value="apresMidi14_16">
              🕑 14h - 16h
            </option>,
            <option key="apresMidi16_18" value="apresMidi16_18">
              🕓 16h - 18h
            </option>,
          ]}
          formData={formData}
          handleFieldChange={handleChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
        />

        {/* Quantité estimée */}
        <FormInput
          label="Quantité estimée (en kg) *"
          name="quantiteEstimee"
          type="number"
          placeholder="Ex: 5"
          formData={formData}
          handleFieldChange={handleChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
        />

        {/* Notes supplémentaires */}
        <FormInput
          label="Notes supplémentaires"
          name="notesSupplementaires"
          type="text"
          placeholder="Instructions particulières, accès, etc."
          formData={formData}
          handleFieldChange={handleChange}
          handleBlur={handleBlur}
          touched={touched}
          errors={errors}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-md active:scale-[0.98]"
        >
          {mode === "edit" ? "Mettre à jour" : "Soumettre la demande"}
        </button>
      </form>
    </div>
  );
};

export default DemandeCollecteTab;
