import React, { useState } from "react";
import { Calendar } from "lucide-react";

const DemandeCollecteTab = () => {
  const [formData, setFormData] = useState({
    typeDechet: "",
    dateSouhaitee: "",
    heurePreferee: "",
    quantiteEstimee: "",
    notesSupplementaires: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare the request body
    const requestBody = {
      type_dechet: formData.typeDechet,
      date_souhaitee: formData.dateSouhaitee,
      heure_preferee: formData.heurePreferee,
      quantite_estimee: formData.quantiteEstimee,
      notes_supplementaires: formData.notesSupplementaires,
      statut: "en_attente",
      date_creation: new Date().toISOString().split("T")[0],
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/client/demande-collecte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Erreur lors de l'envoi de la demande."
        );
      }

      alert("Demande envoyée avec succès !");
      setFormData({
        typeDechet: "",
        dateSouhaitee: "",
        heurePreferee: "",
        quantiteEstimee: "",
        notesSupplementaires: "",
      });
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);
      alert(err.message || "Erreur lors de l'envoi de la demande.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
        Gestion des collectes
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type de déchet */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-gray-700 mb-2">
            Type de déchet *
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: "marcCafe", label: "Marc de café" },
              { value: "coquillesOeufs", label: "Coquilles d'œufs" },
              { value: "lesDeux", label: "Les deux" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 rounded-lg border transition-all cursor-pointer ${
                  formData.typeDechet === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  name="typeDechet"
                  value={option.value}
                  checked={formData.typeDechet === option.value}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Date et heure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date souhaitée *
            </label>
            <div className="relative">
              <input
                type="date"
                name="dateSouhaitee"
                value={formData.dateSouhaitee}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
              <Calendar className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Heure préférée *
            </label>
            <select
              name="heurePreferee"
              value={formData.heurePreferee}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none"
              required
            >
              <option value="">Sélectionnez une heure</option>
              <option value="matin8_10">🕗 8h - 10h</option>
              <option value="matin10_12">🕙 10h - 12h</option>
              <option value="apresMidi14_16">🕑 14h - 16h</option>
              <option value="apresMidi16_18">🕓 16h - 18h</option>
            </select>
          </div>
        </div>

        {/* Quantité estimée */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quantité estimée (en kg) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="quantiteEstimee"
              placeholder="Ex: 5"
              value={formData.quantiteEstimee}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all pr-12"
              required
            />
            <span className="absolute right-4 top-3.5 text-gray-500">kg</span>
          </div>
        </div>

        {/* Notes supplémentaires */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Notes supplémentaires
          </label>
          <textarea
            name="notesSupplementaires"
            placeholder="Instructions particulières, accès, etc."
            value={formData.notesSupplementaires}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none min-h-[100px]"
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          Soumettre la demande
        </button>
      </form>
    </div>
  );
};

export default DemandeCollecteTab;
