import React, { useState, useMemo } from "react";
import {
  Pencil,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Loader2,
  UserX,
  ArrowUpDown,
} from "lucide-react";

const UserTable = ({ users, handleEdit, handleDelete, filterType }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [isDeleting, setIsDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Memoized sorting function
  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (a[key] === null) return 1;
      if (b[key] === null) return -1;

      let compareA = a[key].toString().toLowerCase();
      let compareB = b[key].toString().toLowerCase();

      if (compareA < compareB) return direction === "asc" ? -1 : 1;
      if (compareA > compareB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Handle sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Memoized filtered and sorted data
  const filteredAndSortedUsers = useMemo(() => {
    let result = users.filter((user) => {
      const matchesFilter =
        filterType === "Tous" ||
        user.typeUtilisateur.trim().toLowerCase() === filterType.toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        Object.values(user)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });

    return sortData(result, sortConfig.key, sortConfig.direction);
  }, [users, filterType, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle delete with confirmation
  const handleDeleteClick = async (userId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      setIsDeleting(userId);
      try {
        await handleDelete(userId);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const TableHeader = ({ label, sortKey }) => {
    const isSorted = sortConfig.key === sortKey;
    return (
      <th
        onClick={() => requestSort(sortKey)}
        className="px-6 py-4 text-left text-sm font-medium text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          {label}
          <span className="text-gray-400">
            {isSorted ? (
              sortConfig.direction === "asc" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Search and info bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-100">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <div className="text-sm text-gray-500">
          Total: {filteredAndSortedUsers.length} utilisateur(s)
        </div>
      </div>

      {/* Table */}
      {filteredAndSortedUsers.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
          <UserX className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader label="ID" sortKey="id" />
                <TableHeader label="Nom" sortKey="nom" />
                <TableHeader label="Email" sortKey="email" />
                <TableHeader label="Type" sortKey="typeUtilisateur" />
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{user.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.nom}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        {
                          admin: "bg-purple-100 text-purple-800",
                          client: "bg-blue-100 text-blue-800",
                          commercial: "bg-green-100 text-green-800",
                          chauffeur: "bg-orange-100 text-orange-800",
                        }[user.typeUtilisateur.toLowerCase()] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.typeUtilisateur}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        className="text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => handleEdit(user)}
                        title="Modifier"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      {user.typeUtilisateur.trim().toLowerCase() !==
                        "admin" && (
                        <button
                          className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDeleteClick(user.id)}
                          disabled={isDeleting === user.id}
                          title="Supprimer"
                        >
                          {isDeleting === user.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === i + 1
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
