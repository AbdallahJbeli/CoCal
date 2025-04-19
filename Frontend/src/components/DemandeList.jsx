import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DemandeList = () => {
  const [demandes, setDemandes] = useState([]);
  const navigate = useNavigate();

  // Fetch demandes from the server
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

  // Fetch demandes when the component mounts
  useEffect(() => {
    fetchDemandes();
  }, []);

  // Render the list or a placeholder message
  if (!demandes || demandes.length === 0) {
    return (
      <div className="mt-10 text-center text-gray-500">
        Aucune demande précédente trouvée.
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">Mes demandes précédentes :</h3>
      <ul className="space-y-4">
        {demandes.map((d, index) => (
          <li
            key={index}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
          >
            <p>
              <strong>Déchet :</strong> {d.type_dechet}
            </p>
            <p>
              <strong>Date :</strong> {d.date_souhaitee} à {d.heure_preferee}
            </p>
            <p>
              <strong>Quantité :</strong> {d.quantite_estimee} kg
            </p>
            <p>
              <strong>Statut :</strong>{" "}
              <span className="font-semibold text-blue-600">{d.statut}</span>
            </p>
            {d.notes_supplementaires && (
              <p>
                <strong>Notes :</strong> {d.notes_supplementaires}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DemandeList;
