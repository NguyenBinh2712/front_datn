import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm shadow-sm outline-none ring-offset-2 transition-all duration-200 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 focus-visible:shadow-lg focus-visible:shadow-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-indigo-400 dark:focus-visible:border-indigo-400 dark:focus-visible:shadow-indigo-500/20",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
