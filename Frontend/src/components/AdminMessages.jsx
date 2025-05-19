import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

const AdminMessages = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/admin/problemes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }

        const data = await response.json();
        setProblems(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleStatusUpdate = async (problemId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/admin/problemes/${problemId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update problem status");
      }

      setProblems(prevProblems =>
        prevProblems.map(problem =>
          problem.id === problemId
            ? { ...problem, statut: newStatus }
            : problem
        )
      );
    } catch (err) {
      console.error("Error updating problem status:", err);
      alert("Failed to update problem status");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "en_attente":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "en_cours":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "resolu":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "en_attente":
        return "En attente";
      case "en_cours":
        return "En cours";
      case "resolu":
        return "Résolu";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun problème signalé
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {problems.map((problem) => (
        <div
          key={problem.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(problem.statut)}
                <span className="font-medium text-gray-900">
                  Collecte #{problem.id_demande}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    problem.statut === "en_attente"
                      ? "bg-yellow-100 text-yellow-800"
                      : problem.statut === "en_cours"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {getStatusLabel(problem.statut)}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{problem.description}</p>
              <div className="text-sm text-gray-500">
                Signalé le{" "}
                {new Date(problem.date_signalement).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" par "}
                {problem.chauffeur_nom}
                {" pour le client "}
                {problem.client_nom}
              </div>
            </div>
            {problem.statut !== "resolu" && (
              <div className="flex gap-2">
                {problem.statut === "en_attente" && (
                  <button
                    onClick={() => handleStatusUpdate(problem.id, "en_cours")}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    Prendre en charge
                  </button>
                )}
                {problem.statut === "en_cours" && (
                  <button
                    onClick={() => handleStatusUpdate(problem.id, "resolu")}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                  >
                    Marquer comme résolu
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMessages; 