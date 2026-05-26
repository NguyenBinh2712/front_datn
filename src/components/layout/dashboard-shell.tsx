import { LogOut, Menu, MessageCircle, Moon, Sun, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";

export type DashboardNavItem = {
  to: string;
  label: string;
  end?: boolean;
};

type DashboardShellProps = {
  roleBadge: string;
  headerSubtitle: string;
  nav: DashboardNavItem[];
  extraNav?: ReactNode;
  sidebarAccent?: "indigo" | "emerald";
  loginPath?: string;
  friendsPath?: string;
};

export function DashboardShell({
  roleBadge,
  headerSubtitle,
  nav,
  extraNav,
  sidebarAccent = "indigo",
  loginPath = "/login",
  friendsPath = "/friends",
}: DashboardShellProps) {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const clear = useAuthStore((s) => s.clear);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const [open, setOpen] = useState(false);

  const accent =
    sidebarAccent === "emerald"
      ? {
          card: "bg-emerald-600 shadow-emerald-500/20",
          active: "bg-emerald-600 shadow-emerald-500/25",
          switchActive: "text-emerald-700",
        }
      : {
          card: "bg-indigo-600 shadow-indigo-500/20",
          active: "bg-indigo-600 shadow-indigo-500/25",
          switchActive: "text-indigo-700",
        };

  async function handleLogout() {
    try {
      if (token) await logout(token);
    } catch {
      /* noop */
    }
    clear();
    navigate(loginPath, { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white/95 px-4 py-6 backdrop-blur transition-transform dark:border-slate-800 dark:bg-slate-950/95 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          className={cn(
            "mb-6 rounded-[1.75rem] p-5 text-white shadow-xl",
            accent.card,
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-white">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-semibold">DATN Hub</div>
              <div className="text-xs text-white/80">Nền tảng học tập và kết nối</div>
            </div>
          </div>
          <div className="mt-4 rounded-3xl bg-white/10 p-3 text-sm text-white/95">
            {roleBadge}
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? cn("text-white shadow-md", accent.active)
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {extraNav}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden text-sm font-medium text-slate-600 dark:text-slate-300 md:block">
              {headerSubtitle}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() =>
                setMode(
                  mode === "dark"
                    ? "light"
                    : mode === "light"
                      ? "system"
                      : "dark",
                )
              }
              aria-label="Đổi theme"
            >
              {mode === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(friendsPath)}
            >
              <Users className="mr-2 h-4 w-4" />
              Kết bạn
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {open ? (
        <button
          type="button"
          aria-label="Đóng menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
