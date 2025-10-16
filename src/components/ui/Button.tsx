import React from "react";
import { cn } from "../../lib/utils";

type ButtonIntent = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "ghost";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  intent?: ButtonIntent;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
};

const INTENT_STYLES: Record<ButtonIntent, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-200",
  ghost: "bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-200 dark:text-slate-100 dark:hover:bg-slate-800",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

const VARIANT_TO_INTENT: Record<ButtonVariant, ButtonIntent> = {
  primary: "primary",
  ghost: "ghost",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/**
 * Unified Button primitive used across the app.
 * Supports intent/size tokens and `asChild` composition to wrap other elements.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild = false, intent, variant, size = "md", className = "", children, ...props },
  ref,
) {
  const resolvedIntent = intent ?? (variant ? VARIANT_TO_INTENT[variant] : "primary");
  const classes = cn(BASE_CLASSES, INTENT_STYLES[resolvedIntent], SIZE_STYLES[size], className);

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    const childClassName = cn(child.props.className, classes);
    return React.cloneElement(child, {
      ...props,
      className: childClassName,
      ref,
    } as typeof child.props);
  }

  // eslint-disable-next-line react/button-has-type
  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
