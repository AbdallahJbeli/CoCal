import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
} from "lucide-react";

const ClientDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    en_attente: 0,
    en_cours: 0,
    terminee: 0,
    annulee: 0,
    loading: true,
    error: null,
  });

  const [collections, setCollections] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/client/demande-collecte",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch demandes");

        const data = await res.json();
        setCollections(data);

        const countByStatus = data.reduce((acc, item) => {
          acc[item.statut] = (acc[item.statut] || 0) + 1;
          return acc;
        }, {});

        setStats({
          total: data.length,
          en_attente: countByStatus["en_attente"] || 0,
          en_cours: countByStatus["en_cours"] || 0,
          terminee: countByStatus["terminee"] || 0,
          annulee: countByStatus["annulee"] || 0,
          loading: false,
          error: null,
        });
      } catch (err) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      }
    };

    fetchData();
  }, []);

  const filteredCollections =
    selectedStatus === "all"
      ? collections
      : collections.filter((c) => c.statut === selectedStatus);

  const getStatusLabel = (status) =>
    ({
      en_attente: "En attente",
      en_cours: "En cours",
      terminee: "Terminée",
      annulee: "Annulée",
    }[status] || status);

  const getStatusColor = (status) =>
    ({
      en_attente: "text-yellow-600",
      en_cours: "text-blue-600",
      terminee: "text-green-600",
      annulee: "text-red-600",
    }[status] || "text-gray-600");

  const statCards = [
    {
      title: "Total Demandes",
      value: stats.total,
      icon: <Package className="h-6 w-6 text-indigo-600" />,
      color: "bg-indigo-50 text-indigo-600",
      status: "all",
    },
    {
      title: "En attente",
      value: stats.en_attente,
      icon: <Clock className="h-6 w-6 text-yellow-600" />,
      color: "bg-yellow-50 text-yellow-600",
      status: "en_attente",
    },
    {
      title: "En cours",
      value: stats.en_cours,
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50 text-blue-600",
      status: "en_cours",
    },
    {
      title: "Terminées",
      value: stats.terminee,
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      color: "bg-green-50 text-green-600",
      status: "terminee",
    },
    {
      title: "Annulées",
      value: stats.annulee,
      icon: <XCircle className="h-6 w-6 text-red-600" />,
      color: "bg-red-50 text-red-600",
      status: "annulee",
    },
  ];

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-600">
        {stats.error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Mes Demandes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>{card.icon}</div>
            </div>
            <button
              onClick={() => {
                setSelectedStatus(card.status);
                setShowModal(true);
              }}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <Eye className="h-4 w-4" />
              Voir les détails
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedStatus === "all"
                  ? "Toutes mes demandes"
                  : `Demandes ${getStatusLabel(selectedStatus)}`}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {filteredCollections.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <p className="text-sm text-gray-600">
                    <strong>Type :</strong> {item.type_dechet}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Quantité :</strong> {item.quantite_estimee} kg
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Date souhaitée :</strong>{" "}
                    {new Date(item.date_souhaitee).toLocaleDateString()}
                  </p>

                  <p
                    className={`text-sm font-medium ${getStatusColor(
                      item.statut
                    )}`}
                  >
                    Statut : {getStatusLabel(item.statut)}
                  </p>
                  {item.notes_supplementaires && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Notes :</strong> {item.notes_supplementaires}
                    </p>
                  )}
                  {item.latitude && item.longitude && (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${item.latitude}&mlon=${item.longitude}#map=18/${item.latitude}/${item.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-green-700 hover:underline mt-1"
                    >
                      Voir la localisation
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
