import React, { useState, useEffect } from "react";
import { MessageSquare, Send, CheckCircle, Trash2 } from "lucide-react";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [formData, setFormData] = useState({
    receiver_id: "",
    receiver_type: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (formData.receiver_type) {
      fetchRecipients(formData.receiver_type);
    }
  }, [formData.receiver_type]);

  const fetchRecipients = async (type) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:5000/admin/users/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch recipients");
      }

      const data = await response.json();
      setRecipients(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching recipients:", err);
      setError(err.message);
      setRecipients([]);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/admin/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setFormData({
        receiver_id: "",
        receiver_type: "",
        subject: "",
        message: "",
      });
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/admin/messages/${messageId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark message as read");
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/admin/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete message");
      }
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    } catch (err) {
      console.error("Error deleting message:", err);
      setError("Failed to delete message");
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Nouveau Message
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="receiver_type"
              className="block text-sm font-medium text-gray-700"
            >
              Type de destinataire
            </label>
            <select
              id="receiver_type"
              name="receiver_type"
              value={formData.receiver_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Sélectionner le type de destinataire</option>
              <option value="client">Client</option>
              <option value="commercial">Commercial</option>
              <option value="chauffeur">Chauffeur</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="receiver_id"
              className="block text-sm font-medium text-gray-700"
            >
              Destinataire
            </label>
            <select
              id="receiver_id"
              name="receiver_id"
              value={formData.receiver_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Sélectionner un destinataire</option>
              {recipients.map((recipient) => (
                <option key={recipient.id} value={recipient.id}>
                  {recipient.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Sujet
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Send className="h-4 w-4 mr-2" />
            Envoyer
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Messages ({messages.length})
        </h3>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg border ${
                message.is_read
                  ? "bg-gray-50 border-gray-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                    <h4 className="font-medium text-gray-900">
                      {message.subject}
                    </h4>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    De: {message.sender_nom} ({message.sender_type})
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    À: {message.receiver_nom} ({message.receiver_type})
                  </p>
                  <p className="mt-2 text-gray-700">{message.message}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(message.date_envoi).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  {!message.is_read &&
                    message.receiver_id ===
                      parseInt(localStorage.getItem("userId")) && (
                      <button
                        onClick={() => handleMarkAsRead(message.id)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Marquer comme lu
                      </button>
                    )}
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors mt-2"
                    title="Supprimer le message"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Aucun message pour le moment
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
