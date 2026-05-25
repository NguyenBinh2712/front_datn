import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

const variants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30",
        ghost:
          "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 active:scale-95",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 active:scale-95 hover:border-slate-300 dark:hover:border-slate-600",
        danger:
          "bg-red-600 text-white hover:bg-red-700 active:scale-95 dark:bg-red-500 dark:hover:bg-red-600 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30",
        success:
          "bg-green-600 text-white hover:bg-green-700 active:scale-95 dark:bg-green-500 dark:hover:bg-green-600 shadow-lg shadow-green-500/20",
        secondary:
          "bg-slate-200 text-slate-900 hover:bg-slate-300 active:scale-95 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
      },
      size: {
        xs: "h-8 px-2.5 text-xs",
        sm: "h-9 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-6",
        xl: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof variants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
