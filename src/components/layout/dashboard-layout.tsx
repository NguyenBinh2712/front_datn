import { LogOut, Menu, MessageCircle, Moon, Sun, Users } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { hasRole } from "@/lib/jwt";
import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";

const nav = [
  { to: "/", label: "Trang chủ", end: true },
  { to: "/feed", label: "Bảng tin" },
  { to: "/friends", label: "Bạn bè" },
  { to: "/chat", label: "Tin nhắn" },
  { to: "/quiz", label: "Quiz" },
  { to: "/groups", label: "Nhóm" },
  { to: "/notifications", label: "Thông báo" },
  { to: "/users", label: "Tìm user" },
  { to: "/profile", label: "Hồ sơ" },
];

export function DashboardLayout() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const clear = useAuthStore((s) => s.clear);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    try {
      if (token) await logout(token);
    } catch {
      /* noop */
    }
    clear();
    navigate("/login", { replace: true });
  }

  const showTeacher = token ? hasRole(token, "TEACHER") : false;
  const showAdmin = token ? hasRole(token, "ADMIN") : false;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white/95 px-4 py-6 backdrop-blur transition-transform dark:border-slate-800 dark:bg-slate-950/95 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-6 rounded-[1.75rem] bg-indigo-600 p-5 text-white shadow-xl shadow-indigo-500/20">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-white">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-semibold">DATN Hub</div>
              <div className="text-xs text-indigo-100/80">
                Nền tảng học tập và kết nối
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-3xl bg-white/10 p-3 text-sm text-indigo-100">
            {showAdmin
              ? "Quyền Admin: duyệt nội dung và quản lý hệ thống"
              : showTeacher
                ? "Quyền Giáo viên: tạo quiz và xem nộp bài"
                : "Quyền Học sinh: tham gia quiz và kết nối bạn bè"}
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
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {showTeacher ? (
            <NavLink
              to="/quiz/create"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                )
              }
            >
              Tạo quiz
            </NavLink>
          ) : null}
          {showAdmin ? (
            <>
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amber-600 text-white shadow-md shadow-amber-500/25"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                  )
                }
              >
                Bảng điều khiển Admin
              </NavLink>
              <NavLink
                to="/admin/quizzes"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amber-600 text-white shadow-md shadow-amber-500/25"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                  )
                }
              >
                Duyệt quiz
              </NavLink>
            </>
          ) : null}
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
              Xin chào, sẵn sàng học và kết nối
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
              onClick={() => navigate("/friends")}
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
