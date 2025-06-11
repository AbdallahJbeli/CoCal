import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  User,
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    commercials: 0,
    clients: 0,
    chauffeurs: 0,
    totalCollections: 0,
    pendingCollections: 0,
    activeCollections: 0,
    completedCollections: 0,
    cancelledCollections: 0,
    loading: true,
    error: null,
  });

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const usersResponse = await fetch("http://localhost:5000/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error("Failed to fetch user statistics");
        }

        const usersData = await usersResponse.json();

        const userCounts = usersData.reduce((acc, user) => {
          const type = user.typeUtilisateur.toLowerCase();
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const collectionsResponse = await fetch(
          "http://localhost:5000/admin/collectes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!collectionsResponse.ok) {
          throw new Error("Failed to fetch collection statistics");
        }

        const collectionsData = await collectionsResponse.json();
        setCollections(collectionsData);

        const collectionCounts = collectionsData.reduce((acc, collection) => {
          const status = collection.statut;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalUsers: usersData.length,
          commercials: userCounts.commercial || 0,
          clients: userCounts.client || 0,
          chauffeurs: userCounts.chauffeur || 0,
          totalCollections: collectionsData.length,
          pendingCollections: collectionCounts["en_attente"] || 0,
          activeCollections: collectionCounts["en_cours"] || 0,
          completedCollections: collectionCounts["terminee"] || 0,
          cancelledCollections: collectionCounts["annulee"] || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to load statistics",
        }));
      }
    };

    fetchStats();
  }, []);

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

  const getStatusColor = (status) => {
    const colors = {
      en_attente: "text-yellow-600",
      en_cours: "text-blue-600",
      terminee: "text-green-600",
      annulee: "text-red-600",
    };
    return colors[status] || "text-gray-600";
  };

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

  const userStatCards = [
    {
      title: "Total Utilisateurs",
      value: stats.totalUsers,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Commerciaux",
      value: stats.commercials,
      icon: <Briefcase className="h-6 w-6 text-purple-600" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Clients",
      value: stats.clients,
      icon: <User className="h-6 w-6 text-green-600" />,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Chauffeurs",
      value: stats.chauffeurs,
      icon: <Truck className="h-6 w-6 text-orange-600" />,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  const collectionStatCards = [
    {
      title: "Total Demandes",
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

  const filteredCollections =
    selectedStatus === "all"
      ? collections
      : collections.filter((c) => c.statut === selectedStatus);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Statistiques Utilisateurs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userStatCards.map((card, index) => (
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
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Statistiques Demandes de Collecte
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedStatus === "all"
                    ? "Toutes les demandes"
                    : `Demandes ${getStatusLabel(selectedStatus)}`}
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
                {filteredCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Client
                        </p>
                        <p className="text-base text-gray-900">
                          {collection.client_nom}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Date souhaitée
                        </p>
                        <p className="text-base text-gray-900">
                          {new Date(
                            collection.date_souhaitee
                          ).toLocaleDateString()}
                        </p>
                      </div>
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
                          Quantité estimée
                        </p>
                        <p className="text-base text-gray-900">
                          {collection.quantite_estimee} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Heure préférée
                        </p>
                        <p className="text-base text-gray-900">
                          {collection.heure_preferee}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Statut
                        </p>
                        <p
                          className={`text-base ${getStatusColor(
                            collection.statut
                          )}`}
                        >
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
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${collection.latitude}&mlon=${collection.longitude}#map=18/${collection.latitude}/${collection.longitude}`}
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
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
