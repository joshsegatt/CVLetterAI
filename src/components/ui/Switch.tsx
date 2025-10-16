"use client";

import React from "react";
import { cn } from "../../lib/utils";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { checked = false, onChange, disabled = false, className = "", ariaLabel = "Toggle switch" },
  ref,
) {
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.checked);
    },
    [onChange],
  );

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center",
        disabled ? "opacity-60 cursor-not-allowed" : "",
        className,
      )}
    >
      <span className="sr-only">{ariaLabel}</span>
      <input
        ref={ref}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <div
        aria-hidden
        className={cn(
          "flex h-6 w-10 items-center rounded-full transition-colors",
          checked ? "bg-indigo-600" : "bg-gray-300",
        )}
      >
        <div
          className={cn(
            "h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-1",
          )}
        />
      </div>
    </label>
  );
});

Switch.displayName = "Switch";

export default Switch;
