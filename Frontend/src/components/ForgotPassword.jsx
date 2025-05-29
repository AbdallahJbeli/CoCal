import React, { useState } from "react";
import { AlertCircle, Mail, Loader, ArrowRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left: Image */}
        <div className="hidden md:block md:w-1/2 bg-green-100">
          <img
            src={"/src/assets/images/logo.png"}
            alt="Green leaves"
            className="object-cover w-full h-full"
          />
        </div>
        {/* Right: Forgot Password Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12">
          {/* Logo and Brand */}
          <div className="flex items-center mb-6">
            <span className="bg-green-600 rounded-full w-4 h-4 mr-2 inline-block"></span>
            <span className="font-bold text-lg text-gray-800">CoCal</span>
          </div>
          {/* Title and Subtitle */}
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">
            Forgot Password
          </h2>
          <p className="mb-6 text-gray-500">
            Enter your email to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 text-sm rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border rounded-lg transition-all placeholder-gray-400 bg-gray-50 focus:bg-white border-gray-300 focus:ring-green-500 focus:border-green-500"
                placeholder="Email"
                required
              />
              <Mail className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-lg border border-transparent font-semibold bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
            {/* Back to Login Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-green-600 hover:text-green-700 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
