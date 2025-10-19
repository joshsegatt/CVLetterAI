import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Badge({ 
  children, 
  variant = "default", 
  size = "md", 
  className = "" 
}: BadgeProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-full border transition-all";
  
  const variantClasses = {
    default: "bg-purple-100 text-purple-700 border-purple-200",
    secondary: "bg-gray-100 text-gray-700 border-gray-200",
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-orange-100 text-orange-700 border-orange-200",
    error: "bg-red-100 text-red-700 border-red-200"
  };
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}