import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Truck,
  Calendar,
  Eye,
  MapPin,
} from "lucide-react";

const ChauffeurDashboard = () => {
  const [stats, setStats] = useState({
    totalCollections: 0,
    pendingCollections: 0,
    activeCollections: 0,
    completedCollections: 0,
    cancelledCollections: 0,
    loading: true,
    error: null,
  });

  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/chauffeur/collectes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }

        const collectionsData = await response.json();
        setCollections(collectionsData);

        const collectionCounts = collectionsData.reduce((acc, collection) => {
          const status = collection.statut;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalCollections: collectionsData.length,
          pendingCollections: collectionCounts["en_attente"] || 0,
          activeCollections: collectionCounts["en_cours"] || 0,
          completedCollections: collectionCounts["terminee"] || 0,
          cancelledCollections: collectionCounts["annulee"] || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to load statistics",
        }));
      }
    };

    fetchStats();
  }, []);

  // Get upcoming collections (en_attente or en_cours)
  const upcomingCollections = collections
    .filter((c) => c.statut === "en_attente" || c.statut === "en_cours")
    .sort((a, b) => new Date(a.date_souhaitee) - new Date(b.date_souhaitee))
    .slice(0, 3);

  // Handler to show modal for a specific status
  const handleViewCollections = (status) => {
    setSelectedStatus(status);
    setShowModal(true);
  };

  const getStatusLabel = (status) => {
    const labels = {
      en_attente: "En attente",
      en_cours: "En cours",
      terminee: "Terminées",
      annulee: "Annulées",
    };
    return labels[status] || status;
  };

  const collectionStatCards = [
    {
      title: "Total Collectes",
      value: stats.totalCollections,
      icon: <Package className="h-6 w-6 text-indigo-600" />,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      status: "all",
    },
    {
      title: "En attente",
      value: stats.pendingCollections,
      icon: <Clock className="h-6 w-6 text-yellow-600" />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      status: "en_attente",
    },
    {
      title: "En cours",
      value: stats.activeCollections,
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      status: "en_cours",
    },
    {
      title: "Terminées",
      value: stats.completedCollections,
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      status: "terminee",
    },
    {
      title: "Annulées",
      value: stats.cancelledCollections,
      icon: <XCircle className="h-6 w-6 text-red-600" />,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      status: "annulee",
    },
  ];

  // Filter collections for modal
  const filteredCollections =
    selectedStatus === "all"
      ? collections.filter(
          (c) => c.statut === "en_attente" || c.statut === "en_cours"
        )
      : collections.filter((c) => c.statut === selectedStatus);

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        {stats.error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Statistiques des Collectes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {collectionStatCards.map((card, index) => (
            <div
              key={index}
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
                <div className={`p-3 ${card.bgColor} rounded-lg`}>
                  {card.icon}
                </div>
              </div>
              <button
                onClick={() => handleViewCollections(card.status)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                Voir les détails
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Prochaines Collectes
        </h3>
        {upcomingCollections.length === 0 ? (
          <p className="text-gray-500">Aucune collecte à venir</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingCollections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(collection.date_souhaitee).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "long",
                      }
                    )}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {collection.type_dechet}
                </p>
                <p className="text-sm text-gray-600">
                  {collection.quantite_estimee} kg
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      collection.statut === "en_attente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {getStatusLabel(collection.statut)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedStatus(collection.statut);
                    setShowModal(true);
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  Voir les détails
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for all upcoming collections or filtered by status */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedStatus === "all"
                    ? "Toutes les prochaines collectes"
                    : `Collectes ${getStatusLabel(selectedStatus)}`}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-8rem)]">
              <div className="space-y-4">
                {filteredCollections.length === 0 ? (
                  <p className="text-gray-500">Aucune collecte à afficher</p>
                ) : (
                  filteredCollections.map((collection) => (
                    <div
                      key={collection.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Type de déchet
                          </p>
                          <p className="text-base text-gray-900">
                            {collection.type_dechet}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Date souhaitée
                          </p>
                          <p className="text-base text-gray-900">
                            {collection.date_souhaitee
                              ? new Date(
                                  collection.date_souhaitee
                                ).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Quantité estimée
                          </p>
                          <p className="text-base text-gray-900">
                            {collection.quantite_estimee} kg
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Statut
                          </p>
                          <p className={`text-base`}>
                            {getStatusLabel(collection.statut)}
                          </p>
                        </div>
                      </div>
                      {collection.notes_supplementaires && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-600">
                            Notes supplémentaires
                          </p>
                          <p className="text-base text-gray-900">
                            {collection.notes_supplementaires}
                          </p>
                        </div>
                      )}
                      {collection.latitude && collection.longitude && (
                        <div className="col-span-2 mt-2">
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${collection.latitude}&mlon=${collection.longitude}#map=18/${collection.latitude}/${collection.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-green-700 hover:underline mt-1"
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            Voir la localisation
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChauffeurDashboard;
