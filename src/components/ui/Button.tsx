import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all focus-ring disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      intent: {
        primary:
          'bg-gradient-to-r from-brand to-accent text-white shadow-glow hover:shadow-glow/70',
        secondary:
          'bg-surface-highlight/60 text-neutral-50 hover:bg-surface-highlight',
        ghost: 'bg-transparent text-neutral-200 hover:bg-white/5'
      },
      size: {
        md: 'h-11 gap-2',
        sm: 'h-9 gap-1.5 px-4 text-xs',
        lg: 'h-12 gap-2.5 text-base px-6'
      }
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  intent,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(buttonVariants({ intent, size, className }))} {...props} />
  );
}

export { buttonVariants };
