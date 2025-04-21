import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const UserTable = ({ users, handleEdit, handleDelete, filterType }) => {
  const filteredUsers = users.filter((user) => {
    if (filterType === "Tous") return true;
    return (
      user.typeUtilisateur.trim().toLowerCase() === filterType.toLowerCase()
    );
  });

  return (
    <div className="mt-8">
      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "Nom", "Email", "Type", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-700 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{user.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.nom}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.typeUtilisateur}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      className="text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-gray-100"
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    {user.typeUtilisateur.trim().toLowerCase() !== "admin" && (
                      <button
                        className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTable;
