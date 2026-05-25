import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-slate-200/80 via-slate-100/80 to-slate-200/80 dark:from-slate-800/80 dark:via-slate-700/80 dark:to-slate-800/80",
        className,
      )}
    />
  );
}
