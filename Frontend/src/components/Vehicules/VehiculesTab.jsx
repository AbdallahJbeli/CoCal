import React, { useState, useCallback, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import VehiculeForm from "./VehiculeForm";
import VehiculeTable from "./VehiculeTable";
import { toast } from "react-hot-toast";

const VehiculesTab = () => {
  const [formData, setFormData] = useState({
    matricule: "",
    marque: "",
    modele: "",
    capacite_kg: "",
    etat: "",
    type_vehicule: "",
  });

  const [editingVehicule, setEditingVehicule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const [vehicules, setVehicules] = useState([]);

  const token = localStorage.getItem("token");

  const fetchVehicules = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/vehicules/vehicules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVehicules(data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des véhicules:", err);
      toast.error("Erreur lors de la récupération des véhicules");
    }
  }, [token]);

  useEffect(() => {
    fetchVehicules();
  }, [fetchVehicules]);

  const resetForm = useCallback(() => {
    setFormData({
      matricule: "",
      marque: "",
      modele: "",
      capacite_kg: "",
      etat: "",
      type_vehicule: "",
    });
    setEditingVehicule(null);
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
      const url = editingVehicule
        ? `http://localhost:5000/vehicules/vehicules/${editingVehicule.id}`
        : "http://localhost:5000/vehicules/create-vehicule";

      const method = editingVehicule ? "PUT" : "POST";

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
        editingVehicule
          ? "Véhicule modifié avec succès"
          : "Véhicule créé avec succès"
      );

      resetForm();
      fetchVehicules();
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
      const res = await fetch(
        `http://localhost:5000/vehicules/vehicules/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la suppression");
      }

      toast.success("Véhicule supprimé avec succès");
      fetchVehicules();
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleEdit = useCallback((vehicule) => {
    setEditingVehicule(vehicule);
    setFormData({
      matricule: vehicule.matricule || "",
      marque: vehicule.marque || "",
      modele: vehicule.modele || "",
      capacite_kg: vehicule.capacite_kg || "",
      etat: vehicule.etat || "",
      type_vehicule: vehicule.type_vehicule || "",
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {["Tous", "Camionette", "Triporteur", "Camion"].map((type) => (
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

      <VehiculeForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        editingVehicule={editingVehicule}
        setFormData={setFormData}
        setEditingVehicule={setEditingVehicule}
        resetForm={resetForm}
      />

      <VehiculeTable
        vehicules={vehicules}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        filterType={filterType}
      />
    </div>
  );
};

export default VehiculesTab;
