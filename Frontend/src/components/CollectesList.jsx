import React from "react";

import {
  Trash2,
  CalendarClock,
  Scale,
  Edit,
  Trash,
  X,
  MapPin,
} from "lucide-react";

const CollectesList = ({ demandes, loading, onStatusChange }) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Mes Collectes Assignées
    </h2>
    {loading ? (
      <p className="text-gray-600">Chargement...</p>
    ) : demandes.length === 0 ? (
      <p className="text-gray-600">Aucune collecte trouvée.</p>
    ) : (
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
                        : d.statut === "en_cours"
                        ? "bg-blue-100 text-blue-800"
                        : d.statut === "terminee"
                        ? "bg-green-100 text-green-800"
                        : d.statut === "annulee"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {d.statut}
                </span>

                <select
                  value={d.statut}
                  onChange={(e) => onStatusChange(d.id, e.target.value)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  <option value="en_attente">En attente</option>
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                  <option value="annulee">Annulée</option>
                </select>
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
              {d.latitude && d.longitude && (
                <a
                  href={`https://www.openstreetmap.org/?mlat=${d.latitude}&mlon=${d.longitude}#map=18/${d.latitude}/${d.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-green-700 hover:underline mt-2"
                >
                  <MapPin className="w-4 h-4" />
                  Voir la localisation
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default CollectesList;
