import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

const ChauffeurCollectesList = () => {
  const [collectes, setCollectes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [selectedCollecte, setSelectedCollecte] = useState(null);
  const [problemDescription, setProblemDescription] = useState("");

  useEffect(() => {
    const fetchCollectes = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/chauffeur/collectes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCollectes(await res.json());
      }
      setLoading(false);
    };
    fetchCollectes();
  }, []);

  const handleStatusUpdate = async (collecteId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/chauffeur/collectes/${collecteId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setCollectes(prevCollectes =>
          prevCollectes.map(col =>
            col.id === collecteId ? { ...col, statut: newStatus } : col
          )
        );
      } else {
        alert("Erreur lors de la mise à jour du statut");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue");
    }
  };

  const handleReportProblem = async () => {
    if (!problemDescription.trim()) {
      alert("Veuillez décrire le problème");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/chauffeur/collectes/${selectedCollecte.id}/problem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: problemDescription }),
        }
      );

      if (res.ok) {
        setCollectes(prevCollectes =>
          prevCollectes.map(col =>
            col.id === selectedCollecte.id ? { ...col, statut: "probleme" } : col
          )
        );
        setShowProblemModal(false);
        setProblemDescription("");
        setSelectedCollecte(null);
      } else {
        alert("Erreur lors du signalement du problème");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue");
    }
  };

  if (loading)
    return <div className="text-green-700">Chargement des collectes...</div>;
  if (!collectes.length)
    return <div className="text-gray-400">Aucune collecte assignée.</div>;

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 border border-green-100">
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Mes Collectes Assignées
        </h3>
        <ul className="space-y-3">
          {collectes.map((col) => (
            <li key={col.id} className="border-b pb-2 last:border-b-0">
              <div className="font-semibold text-green-700">
                {col.type_dechet}
              </div>
              <div className="text-sm text-gray-700">
                {new Date(col.date_souhaitee).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                })}{" "}
                à {col.heure_preferee}
              </div>
              <div className="text-xs text-gray-500">Statut : {col.statut}</div>
              <div className="text-xs text-gray-500">
                Quantité estimée : {col.quantite_estimee} kg
              </div>
              {col.notes_supplementaires && (
                <div className="text-xs text-green-800 mt-1">
                  Note : {col.notes_supplementaires}
                </div>
              )}
              
              {/* Action buttons */}
              {col.statut !== "terminee" && col.statut !== "probleme" && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(col.id, "terminee")}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marquer comme terminée
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCollecte(col);
                      setShowProblemModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Signaler un problème
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Problem Report Modal */}
      {showProblemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Signaler un problème
            </h3>
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Décrivez le problème rencontré..."
              className="w-full h-32 p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowProblemModal(false);
                  setProblemDescription("");
                  setSelectedCollecte(null);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleReportProblem}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChauffeurCollectesList;
