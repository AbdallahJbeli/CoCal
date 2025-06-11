import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Mail,
  Key,
  ArrowRight,
  Loader,
  Eye,
  EyeOff,
  Facebook,
  Instagram,
  Github,
} from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const redirectBasedOnRole = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        navigate("/admin-space");
        break;
      case "client":
        navigate("/client-space");
        break;
      case "commercial":
        navigate("/commercial-space");
        break;
      case "chauffeur":
        navigate("/chauffeur-space");
        break;
      default:
        navigate("/");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = decoded.exp * 1000;

        if (expirationTime > Date.now()) {
          redirectBasedOnRole(decoded.typeUtilisateur);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.motDePasse) {
      newErrors.motDePasse = "Le mot de passe est requis";
    } else if (formData.motDePasse.length < 6) {
      newErrors.motDePasse =
        "Le mot de passe doit contenir au moins 6 caractères";
    } else if (
      formData.motDePasse &&
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.motDePasse)
    ) {
      newErrors.motDePasse =
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setServerError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        // `${import.meta.env.VITE_APP_BACKEND_URL}/auth/login`,
        `http://localhost:5000/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      const { token } = response.data;

      localStorage.setItem("token", token);

      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded && decoded.id) {
        localStorage.setItem("userId", decoded.id);
      }
      redirectBasedOnRole(decoded.typeUtilisateur);
    } catch (err) {
      let errorMessage = "Erreur lors de la connexion";

      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        errorMessage = "Impossible de contacter le serveur";
      }

      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    return () => {
      setFormData({ email: "", motDePasse: "" });
      setErrors({});
      setServerError("");
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left: Image */}
        <div className="hidden md:block md:w-[56%] bg-green-100">
          <img
            src={"/src/assets/images/logo.png"}
            alt="Green leaves"
            className="object-cover w-full h-full"
          />
        </div>
        {/* Right: Login Form */}
        <div className="w-full md:w-[44%] flex flex-col justify-center p-8 sm:p-12">
          {/* Logo and Brand */}
          <div className="flex items-center mb-6">
            <span className="bg-green-600 rounded-full w-4 h-4 mr-2 inline-block"></span>
            <span className="font-bold text-lg text-gray-800">CoCal</span>
          </div>
          {/* Welcome Text */}
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">
            Hello,
            <br />
            Welcome Back to CoCal!
          </h2>
          <p className="mb-6 text-gray-500">Login to manage your account.</p>

          {serverError && (
            <div className="mb-4 p-3 text-sm rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4 relative flex flex-col">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg transition-all placeholder-gray-400 bg-gray-50 focus:bg-white ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                  } pr-12`}
                  placeholder="Email"
                  autoComplete="username"
                />
                <Mail className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <div className="min-h-[20px]">
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium pl-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            {/* Password */}
            <div className="mb-4 relative flex flex-col">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg transition-all placeholder-gray-400 bg-gray-50 focus:bg-white ${
                    errors.motDePasse
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                  } pr-12`}
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="min-h-[20px]">
                {errors.motDePasse && (
                  <p className="mt-1 text-xs text-red-600 font-medium pl-1">
                    {errors.motDePasse}
                  </p>
                )}
              </div>
            </div>
            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-lg border border-transparent font-semibold bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
            <div className="flex justify-center mb-6">
              <a
                href="/forgot-password"
                className="text-sm text-green-600 hover:text-green-700 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
