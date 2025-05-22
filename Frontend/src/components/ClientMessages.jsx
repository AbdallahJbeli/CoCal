import React, { useState, useEffect } from "react";
import { MessageSquare, Send, CheckCircle } from "lucide-react";

const ClientMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    receiver_id: "",
    receiver_type: "commercial",
    subject: "",
    message: "",
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/client/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
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
      const response = await fetch("http://localhost:5000/client/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to send message");
      }

      setFormData({
        receiver_id: "",
        receiver_type: "commercial",
        subject: "",
        message: "",
      });
      fetchMessages();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/client/messages/${messageId}/read`,
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
          msg.id === messageId ? { ...msg, is_read: 1 } : msg
        )
      );
    } catch (err) {
      console.error("Error marking message as read:", err);
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
      {/* Message Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Envoyer un message
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de destinataire
              </label>
              <select
                name="receiver_type"
                value={formData.receiver_type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="commercial">Commercial</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID du destinataire
              </label>
              <input
                type="number"
                name="receiver_id"
                value={formData.receiver_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sujet
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Send className="w-4 h-4 mr-2" />
            Envoyer
          </button>
        </form>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Messages</h3>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Aucun message</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-lg shadow-sm border ${
                msg.is_read ? "border-gray-200" : "border-green-200"
              } p-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare
                      className={`w-5 h-5 ${
                        msg.is_read ? "text-gray-400" : "text-green-500"
                      }`}
                    />
                    <span className="font-medium text-gray-900">
                      {msg.subject}
                    </span>
                    {!msg.is_read &&
                      msg.receiver_id ===
                        parseInt(localStorage.getItem("userId")) && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Non lu
                        </span>
                      )}
                  </div>
                  <p className="text-gray-600 mb-2">{msg.message}</p>
                  <div className="text-sm text-gray-500">
                    De: {msg.sender_nom} ({msg.sender_type})
                    <br />
                    À: {msg.receiver_nom} ({msg.receiver_type})
                    <br />
                    Le: {new Date(msg.date_envoi).toLocaleString("fr-FR")}
                  </div>
                </div>
                {!msg.is_read &&
                  msg.receiver_id ===
                    parseInt(localStorage.getItem("userId")) && (
                    <button
                      onClick={() => handleMarkAsRead(msg.id)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Marquer comme lu
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientMessages;
