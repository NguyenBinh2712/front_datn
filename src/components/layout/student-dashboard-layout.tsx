import {
  DashboardShell,
  type DashboardNavItem,
} from "@/components/layout/dashboard-shell";

const studentNav: DashboardNavItem[] = [
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

export function StudentDashboardLayout() {
  return (
    <DashboardShell
      sidebarAccent="indigo"
      roleBadge="Khu vực Học sinh — tham gia quiz, nhóm và kết nối bạn bè"
      headerSubtitle="Xin chào, sẵn sàng học và kết nối"
      nav={studentNav}
      loginPath="/login"
      friendsPath="/friends"
    />
  );
}
