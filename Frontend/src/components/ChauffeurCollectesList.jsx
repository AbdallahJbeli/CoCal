import React, { useEffect, useState } from "react";

const ChauffeurCollectesList = () => {
  const [collectes, setCollectes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return <div className="text-green-700">Chargement des collectes...</div>;
  if (!collectes.length)
    return <div className="text-gray-400">Aucune collecte assignée.</div>;

  return (
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChauffeurCollectesList;
