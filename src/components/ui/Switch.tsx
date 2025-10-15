import React from "react";

type SwitchProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export default function Switch({ checked = false, onChange, disabled = false, className = "" }: SwitchProps) {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
      />
      <div
        aria-hidden
        className={`w-10 h-6 transition-colors rounded-full ${checked ? "bg-indigo-600" : "bg-gray-300"} ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
            checked ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </div>
    </label>
  );
}
