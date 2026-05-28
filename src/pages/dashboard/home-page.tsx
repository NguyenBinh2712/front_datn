import {
  ArrowRight,
  BookOpen,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hasRole } from "@/lib/jwt";
import { useAuthStore } from "@/stores/auth-store";

export function DashboardHomePage() {
  const token = useAuthStore((s) => s.token);
  const showAdmin = token ? hasRole(token, "ADMIN") : false;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-[2rem] bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-500 p-8 text-white shadow-[0_30px_80px_-40px_rgba(59,130,246,0.7)]">
        <div className="max-w-3xl space-y-6">
          <div className="text-sm uppercase tracking-[0.35em] text-cyan-100/80">
            Chào mừng đến với DATN Hub
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Nền tảng học tập và giao tiếp dành cho học sinh năng động
          </h1>
          <p className="max-w-2xl text-base leading-7 text-cyan-100/90 sm:text-lg">
            Kết nối bạn bè, học nhóm, tạo quiz và nhận đánh giá nhanh chóng.
            Giao diện được thiết kế để trực quan, chuyên nghiệp và phù hợp với
            giới học sinh.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/quiz">
              <Button size="lg">Khám phá quiz</Button>
            </Link>
            <Link to="/friends">
              <Button size="lg" variant="outline">
                Kết nối bạn bè
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Tổng quan
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Bảng điều khiển cá nhân
              </h2>
            </div>
            <div className="rounded-3xl bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Cộng đồng
              </p>
              <p className="mt-3 text-2xl font-semibold">Kết nối</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Thảo luận cùng bạn bè và giáo viên.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Học tập
              </p>
              <p className="mt-3 text-2xl font-semibold">Quiz</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Thử thách bản thân với các bài kiểm tra thú vị.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                Phát triển
              </p>
              <p className="mt-3 text-2xl font-semibold">Thành tích</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Tăng điểm, hoàn thành quiz và nhận phản hồi.
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Nhiệm vụ nhanh
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Bắt đầu ngay</h2>
            </div>
            <div className="rounded-3xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
              Xu hướng
            </div>
          </div>
          <div className="space-y-3">
            <Link
              to="/quiz"
              className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-cyan-300" />
                <div>
                  <p className="font-semibold">Khám phá quiz mới</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Ôn tập kiến thức ngay lập tức.
                  </p>
                </div>
              </div>
            </Link>
            <Link
              to="/friends"
              className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                <div>
                  <p className="font-semibold">Kết nối bạn bè</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Mở rộng mạng lưới học tập của bạn.
                  </p>
                </div>
              </div>
            </Link>
            <Link
              to="/chat"
              className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                <div>
                  <p className="font-semibold">Chat nhóm</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Trao đổi nhanh với lớp học.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {showAdmin ? (
        <Card className="space-y-6 rounded-[1.75rem] border border-amber-200 bg-amber-50/80 p-6 shadow-lg shadow-amber-200/30 dark:border-amber-800 dark:bg-amber-950/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-amber-700 dark:text-amber-200">
                Admin center
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                Giao diện quản lý Admin
              </h2>
            </div>
            <div className="rounded-3xl bg-white/80 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm dark:bg-amber-900/60 dark:text-amber-200">
              Quản lý toàn hệ thống
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              to="/teacher/admin"
              className="rounded-3xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-950"
            >
              <p className="text-sm font-semibold">Xem bảng điều khiển Admin</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Quản lý user, post, quiz và group trong một nơi.
              </p>
            </Link>
            <Link
              to="/teacher/admin/quizzes"
              className="rounded-3xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-950"
            >
              <p className="text-sm font-semibold">Duyệt quiz</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Quản lý các quiz đang chờ phê duyệt.
              </p>
            </Link>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="space-y-4 p-6">
          <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-300">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-base font-semibold">Thiết kế thu hút</h3>
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Giao diện thân thiện, màu sắc nhẹ nhàng và tối ưu cho học sinh. Tập
            trung vào hành động và trải nghiệm học tập.
          </p>
        </Card>
        <Card className="space-y-4 p-6">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-300">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="text-base font-semibold">Phân quyền rõ ràng</h3>
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Hệ thống phân quyền giúp Admin và Teacher quản lý nhanh chóng, còn
            học sinh tập trung vào làm bài và giao tiếp.
          </p>
        </Card>
        <Card className="space-y-4 p-6">
          <div className="flex items-center gap-3 text-sky-600 dark:text-sky-300">
            <ArrowRight className="h-5 w-5" />
            <h3 className="text-base font-semibold">Truy cập nhanh</h3>
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Chuyển nhanh đến quiz, nhóm, chat và quản lý admin ngay trong một
            giao diện gọn gàng.
          </p>
        </Card>
      </div>
    </div>
  );
}
