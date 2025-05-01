import React from "react";
import { AlertCircle } from "lucide-react";

const TypeDechetRadioGroup = ({
  options,
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => (
  <fieldset className="space-y-4">
    <legend className="text-sm font-semibold text-gray-700 mb-2">
      Type de déchet *
    </legend>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer
            ${
              value === option.value
                ? "border-green-500 bg-green-50 ring-2 ring-green-100"
                : error && touched
                ? "border-red-500"
                : "border-gray-200 hover:border-green-300"
            }`}
        >
          <input
            type="radio"
            name="typeDechet"
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            onBlur={onBlur}
            className="h-4 w-4 text-green-600 focus:ring-green-500"
          />
          <span className="ml-3 text-gray-700 font-medium">{option.label}</span>
        </label>
      ))}
    </div>
    {error && touched && (
      <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </fieldset>
);

export default TypeDechetRadioGroup;
