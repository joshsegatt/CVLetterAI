import React from "react";
import { cn } from "../../lib/utils";

type ButtonIntent = "primary" | "secondary" | "ghost" | "luxury" | "danger" | "success";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonVariant = "primary" | "ghost" | "outline" | "luxury" | "gradient";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  intent?: ButtonIntent;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const INTENT_STYLES: Record<ButtonIntent, string> = {
  primary: `
    relative overflow-hidden group
    bg-gradient-brand hover:bg-white
    text-white hover:text-black font-semibold
    shadow-lg shadow-primary-500/25
    hover:shadow-xl hover:shadow-primary-500/40
    hover:scale-105
    focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    transition-all duration-300
  `,
  secondary: `
    relative overflow-hidden
    bg-surface-700/50 backdrop-blur-sm
    text-surface-100 font-medium
    border border-surface-600/50
    hover:bg-surface-600/50 hover:border-surface-500/50
    hover:scale-[1.02]
    shadow-md shadow-black/10
    focus-visible:ring-2 focus-visible:ring-surface-400 focus-visible:ring-offset-2
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  ghost: `
    relative overflow-hidden
    bg-transparent
    text-surface-100 font-medium
    hover:bg-white/5
    hover:scale-[1.02]
    focus-visible:ring-2 focus-visible:ring-surface-400 focus-visible:ring-offset-2
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  luxury: `
    relative overflow-hidden group
    bg-gradient-luxury
    text-white font-bold
    shadow-lg shadow-luxury-500/25
    hover:shadow-xl hover:shadow-luxury-500/40
    hover:scale-105
    focus-visible:ring-2 focus-visible:ring-luxury-500 focus-visible:ring-offset-2
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  danger: `
    relative overflow-hidden
    bg-red-600
    text-white font-semibold
    shadow-lg shadow-red-500/25
    hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/40
    hover:scale-105
    focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  success: `
    relative overflow-hidden
    bg-green-600
    text-white font-semibold
    shadow-lg shadow-green-500/25
    hover:bg-green-700 hover:shadow-xl hover:shadow-green-500/40
    hover:scale-105
    focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  xs: "h-7 px-2 text-xs rounded-md gap-1",
  sm: "h-9 px-3 text-sm rounded-lg gap-1.5",
  md: "h-11 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2",
  xl: "h-14 px-8 text-lg rounded-2xl gap-3",
};

const VARIANT_TO_INTENT: Record<ButtonVariant, ButtonIntent> = {
  primary: "primary",
  ghost: "ghost",
  outline: "secondary",
  luxury: "luxury",
  gradient: "primary",
};

const BASE_CLASSES = `
  inline-flex items-center justify-center
  whitespace-nowrap font-medium
  transition-all duration-300 ease-in-out
  focus-visible:outline-none
  select-none cursor-pointer
  relative z-10
`;

/**
 * Ultra Modern Button Component - Apple/Google Style
 * Features: Premium gradients, glass morphism, micro-interactions, loading states
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { 
    asChild = false, 
    intent, 
    variant, 
    size = "md", 
    className = "", 
    loading = false,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  },
  ref,
) {
  const resolvedIntent = intent ?? (variant ? VARIANT_TO_INTENT[variant] : "primary");
  const isDisabled = disabled || loading;
  
  const classes = cn(
    BASE_CLASSES, 
    INTENT_STYLES[resolvedIntent], 
    SIZE_STYLES[size], 
    className
  );

  const buttonContent = (
    <>
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      )}
      
      {/* Content Container */}
      <div className={cn("flex items-center gap-inherit relative z-10", loading && "opacity-0")}>
        {leftIcon && (
          <span className="flex-shrink-0">
            {leftIcon}
          </span>
        )}
        
        {children && (
          <span className="relative">
            {children}
          </span>
        )}
        
        {rightIcon && (
          <span className="flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </div>

      {/* Shimmer Effect for Primary Buttons */}
      {resolvedIntent === "primary" && (
        <div className="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/20 to-transparent rotate-12 transition-all duration-700 group-hover:top-full" />
      )}
    </>
  );

  if (asChild && React.isValidElement(children) && !loading) {
    const child = children as React.ReactElement<{ className?: string }>;
    const childClassName = cn(child.props.className, classes);
    return React.cloneElement(child, {
      ...props,
      className: childClassName,
      ref,
    } as typeof child.props);
  }

  return (
    <button 
      ref={ref} 
      className={classes} 
      disabled={isDisabled}
      {...props}
    >
      {buttonContent}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
