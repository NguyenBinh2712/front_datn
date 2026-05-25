import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[96px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none ring-offset-2 transition-all duration-200 resize-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 focus-visible:shadow-lg focus-visible:shadow-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-indigo-400 dark:focus-visible:border-indigo-400 dark:focus-visible:shadow-indigo-500/20",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
