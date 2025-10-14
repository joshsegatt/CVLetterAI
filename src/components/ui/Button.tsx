"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent = "primary", size = "md", ...props }, ref) => {
    const intentClasses = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700",
      secondary: "bg-neutral-700 text-white hover:bg-neutral-600",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizeClasses = {
      sm: "px-3 py-1 text-sm rounded-md",
      md: "px-4 py-2 text-base rounded-md",
      lg: "px-6 py-3 text-lg rounded-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2",
          intentClasses[intent],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
