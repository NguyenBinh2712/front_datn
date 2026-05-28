import { ArrowRight, FileText, Layers, Users } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Card } from "@/components/ui/card";

const adminNav = [
  { label: "Tổng quan", to: "/teacher/admin" },
  { label: "Người dùng", to: "/teacher/admin/users" },
  { label: "Bài viết", to: "/teacher/admin/posts" },
  { label: "Duyệt quiz", to: "/teacher/admin/quizzes" },
  { label: "Nhóm học tập", to: "/teacher/admin/groups" },
];

export function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 dark:bg-slate-950 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] bg-slate-950 p-6 text-slate-100 shadow-2xl shadow-slate-900/20">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-500 text-base font-semibold text-white">
              E
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                EduNet Admin
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Bảng quản trị
              </h2>
            </div>
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-400">
            Giao diện quản lý chuyên biệt cho Admin, tập trung vào người dùng,
            bài viết, quiz và nhóm.
          </p>

          <nav className="mt-8 space-y-2">
            {adminNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-200 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-[1.75rem] bg-slate-900/80 p-5 text-sm text-slate-400 shadow-inner shadow-slate-900/20">
            <p className="font-semibold text-slate-100">Lưu ý</p>
            <p className="mt-3 leading-6">
              Admin có thể kiểm soát toàn bộ nội dung. Sử dụng các liên kết bên
              để vào nhanh các mục quan trọng.
            </p>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm dark:bg-slate-900 dark:shadow-slate-900/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-indigo-500">
                  Tổng quan
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                  Quản lý hệ thống EduNet
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Nhanh chóng theo dõi trạng thái và điều hướng đến các công cụ
                  admin quan trọng.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/teacher/admin/quizzes"
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Duyệt quiz
                </Link>
                <Link
                  to="/teacher/admin/users"
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Quản lý người dùng
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Link to="/teacher/admin/users">
              <Card className="space-y-3 p-6 cursor-pointer transition hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Tổng người dùng
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                      3
                    </p>
                  </div>
                  <div className="rounded-3xl bg-indigo-100 p-3 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Nhấn để quản lý tài khoản.
                </p>
              </Card>
            </Link>
            <Link to="/teacher/admin/posts">
              <Card className="space-y-3 p-6 cursor-pointer transition hover:shadow-md hover:border-red-200 dark:hover:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Bài viết cần xem
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                      0
                    </p>
                  </div>
                  <div className="rounded-3xl bg-red-100 p-3 text-red-700 dark:bg-red-900/30 dark:text-red-200">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Nhấn để quản lý bài viết.
                </p>
              </Card>
            </Link>
            <Link to="/teacher/admin/quizzes">
              <Card className="space-y-3 p-6 cursor-pointer transition hover:shadow-md hover:border-cyan-200 dark:hover:border-cyan-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Quiz cần duyệt
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                      0
                    </p>
                  </div>
                  <div className="rounded-3xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200">
                    <Layers className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Nhấn để duyệt quiz.
                </p>
              </Card>
            </Link>
            <Link to="/teacher/admin/groups">
              <Card className="space-y-3 p-6 cursor-pointer transition hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Nhóm học tập
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                      0
                    </p>
                  </div>
                  <div className="rounded-3xl bg-purple-100 p-3 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Nhấn để quản lý nhóm.
                </p>
              </Card>
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-3xl bg-indigo-500 p-3 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Quản lý người dùng
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Tìm kiếm, xem hồ sơ và giám sát hoạt động user.
                  </p>
                </div>
              </div>
              <Link
                to="/teacher/admin/users"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Mở ngay
              </Link>
            </Card>
            <Card className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-3xl bg-slate-100 p-3 text-slate-900 dark:bg-slate-800 dark:text-white">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Hành động nhanh
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Xem nhanh báo cáo, duyệt quiz và kiểm tra nhóm học.
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                <Link
                  to="/teacher/admin/quizzes"
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Duyệt quiz
                </Link>
                <Link
                  to="/teacher/feed"
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Kiểm tra bài viết
                </Link>
              </div>
            </Card>
          </div>

          <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                  Lời khuyên
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  Giữ hệ thống sạch và an toàn
                </h2>
              </div>
              <Link
                to="/teacher/admin/quizzes"
                className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                Duyệt ngay
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-4 text-sm dark:bg-slate-950">
                <p className="font-semibold">Tập trung</p>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Xem nhanh những gì cần xử lý.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 text-sm dark:bg-slate-950">
                <p className="font-semibold">An toàn</p>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Giữ nội dung phù hợp cho học sinh.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 text-sm dark:bg-slate-950">
                <p className="font-semibold">Nhanh</p>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Truy cập mọi chức năng chỉ trong vài cú click.
                </p>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
