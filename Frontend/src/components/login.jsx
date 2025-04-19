import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Mail, Key, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        motDePasse,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (decoded.typeUtilisateur === "admin") {
        navigate("/admin-space");
      } else if (decoded.typeUtilisateur === "client") {
        navigate("/client-space");
      } else if (decoded.typeUtilisateur === "commercial") {
        navigate("/commercial-space");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de la connexion");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md mx-4 transition-all duration-300 hover:shadow-xl"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Connexion
        </h2>

        {error && (
          <div className="mb-6 p-3 text-sm rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-gray-400"
              placeholder="exemple@email.com"
            />
            <Mail className="h-5 w-5 absolute right-3 top-3.5 text-gray-400" />
          </div>
        </div>

        <div className="mb-7">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder-gray-400"
              placeholder="••••••••"
            />
            <Key className="h-5 w-5 absolute right-3 top-3.5 text-gray-400" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-lg border border-transparent font-semibold bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all transform hover:scale-[1.01]"
        >
          Se connecter
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default Login;
