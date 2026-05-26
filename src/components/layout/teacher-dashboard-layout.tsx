import { NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";
import { hasRole } from "@/lib/jwt";
import { useAuthStore } from "@/stores/auth-store";
import {
  DashboardShell,
  type DashboardNavItem,
} from "@/components/layout/dashboard-shell";

const teacherNav: DashboardNavItem[] = [
  { to: "/teacher", label: "Trang chủ", end: true },
  { to: "/teacher/feed", label: "Bảng tin" },
  { to: "/teacher/friends", label: "Bạn bè" },
  { to: "/teacher/chat", label: "Tin nhắn" },
  { to: "/teacher/quiz", label: "Quiz" },
  { to: "/teacher/groups", label: "Nhóm" },
  { to: "/teacher/notifications", label: "Thông báo" },
  { to: "/teacher/users", label: "Tìm user" },
  { to: "/teacher/profile", label: "Hồ sơ" },
];

function adminNavLinkClass(isActive: boolean) {
  return cn(
    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-amber-600 text-white shadow-md shadow-amber-500/25"
      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  );
}

export function TeacherDashboardLayout() {
  const token = useAuthStore((s) => s.token);
  const showAdmin = token ? hasRole(token, "ADMIN") : false;

  const roleBadge = showAdmin
    ? "Khu vực Admin — duyệt nội dung và quản lý hệ thống"
    : "Khu vực Giáo viên — tạo quiz, quản lý nhóm và xem nộp bài";

  return (
    <DashboardShell
      sidebarAccent="emerald"
      roleBadge={roleBadge}
      headerSubtitle="Quản lý lớp học, quiz và nhóm học tập"
      nav={teacherNav}
      loginPath="/teacher/login"
      friendsPath="/teacher/friends"
      extraNav={
        <>
          <NavLink
            to="/teacher/quiz/create"
            className={({ isActive }) =>
              cn(
                "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
              )
            }
          >
            Tạo quiz
          </NavLink>
          {showAdmin ? (
            <>
              <NavLink
                to="/teacher/admin"
                className={({ isActive }) => adminNavLinkClass(isActive)}
              >
                Bảng điều khiển Admin
              </NavLink>
              <NavLink
                to="/teacher/admin/quizzes"
                className={({ isActive }) => adminNavLinkClass(isActive)}
              >
                Duyệt quiz
              </NavLink>
            </>
          ) : null}
        </>
      }
    />
  );
}
