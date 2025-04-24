import React from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  options = null,
  formData,
  handleFieldChange,
  handleBlur,
  touched,
  errors,
  showPassword,
  setShowPassword,
}) => {
  const isSelect = type === "select";
  const showError = touched[name] && errors[name];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {["Client", "Commercial", "Chauffeur"].includes(
          formData.typeUtilisateur
        ) &&
          [
            "nom",
            "email",
            "motDePasse",
            "num_telephone",
            "adresse",
            "type_client",
            "id_commercial",
          ].includes(name) && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {isSelect ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-lg transition-all ${
              showError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 focus:ring-green-500 focus:border-green-500"
            }`}
          >
            <option value="">{placeholder}</option>
            {options}
          </select>
        ) : (
          <>
            <input
              name={name}
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-lg transition-all ${
                showError
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-green-500 focus:border-green-500"
              }`}
            />
            {type === "password" && formData[name] && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
          </>
        )}
      </div>
      {showError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );
};

export default FormInput;
