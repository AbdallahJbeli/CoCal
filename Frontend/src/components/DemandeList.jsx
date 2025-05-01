import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DemandeCollecteTab from "./DemandeCollecteTab";
import {
  Trash2,
  CalendarClock,
  Scale,
  Edit,
  Trash,
  X,
  MapPin,
} from "lucide-react";
import { toast } from "react-hot-toast";

const DemandeList = () => {
  const [demandes, setDemandes] = useState([]);
  const [editingDemande, setEditingDemande] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [demandeToDelete, setDemandeToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchDemandes = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/client/demande-collecte", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403 || res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      setDemandes(data);
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/client/demande-collecte/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        setDemandes((prev) => prev.filter((d) => d.id !== id));
        toast.success("Demande supprimée avec succès !");
      } else {
        toast.error("Erreur lors de la suppression.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleEdit = (demande) => {
    setEditingDemande(demande);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingDemande(null);
    fetchDemandes();
  };

  if (!demandes || demandes.length === 0) {
    return (
      <div className="mt-10 text-center text-gray-500">
        Aucune demande précédente trouvée.
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Mes demandes précédentes :
      </h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {demandes.map((d) => (
          <li
            key={d.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                  ${
                    d.statut === "en_attente"
                      ? "bg-yellow-100 text-yellow-800"
                      : d.statut === "confirmée"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {d.statut}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(d.date_creation).toLocaleDateString("fr-FR")}
                </span>
              </div>

              <div className="space-y-1">
                <p className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{d.type_dechet}</span>
                </p>
                <p className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-gray-500" />
                  {new Date(d.date_souhaitee).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                  })}{" "}
                  à {d.heure_preferee}
                </p>
                <p className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-gray-500" />
                  {d.quantite_estimee} kg
                </p>
              </div>

              {d.notes_supplementaires && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {d.notes_supplementaires}
                  </p>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(d)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(true);
                    setDemandeToDelete(d.id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                  <Trash className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {showEditModal && editingDemande && (
        <div className="fixed inset-0 bg-black bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-xl relative animate-scale-in">
            <button
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowEditModal(false)}
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
            <DemandeCollecteTab
              editingDemande={editingDemande}
              onEditSuccess={handleEditSuccess}
              mode="edit"
            />
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h4 className="text-lg font-bold mb-4">Confirmer la suppression</h4>
            <p className="mb-6">
              Voulez-vous vraiment supprimer cette demande ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  setShowConfirmModal(false);
                  await handleDelete(demandeToDelete);
                  setDemandeToDelete(null);
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandeList;
