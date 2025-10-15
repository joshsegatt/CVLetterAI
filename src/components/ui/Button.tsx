import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ children, className = "", variant = "primary", ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none";
  const styles =
    variant === "primary"
      ? "px-4 py-2 bg-slate-800 text-white hover:bg-slate-700"
      : "px-3 py-1 bg-transparent text-slate-800 border";
  return (
    // eslint-disable-next-line react/button-has-type
    <button {...props} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
