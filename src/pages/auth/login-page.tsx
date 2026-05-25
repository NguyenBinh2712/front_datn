import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { login } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Tối thiểu 6 ký tự"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    const token = await login(values);
    setToken(token);
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-10 text-white shadow-2xl shadow-indigo-500/20"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-3xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/20 text-2xl font-bold text-white">
                E
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/80">
                  EduNet
                </p>
                <p className="mt-1 text-sm text-white/80">
                  Học cùng nhau, tiến xa hơn.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold leading-tight tracking-tight">
                Học cùng nhau. Tiến xa hơn.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Nền tảng giao tiếp & học tập dành cho học sinh, giáo viên và
                cộng đồng tri thức.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.25em] text-white/70">
                Tính năng nổi bật
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li>• Kết nối học sinh, giáo viên và nhóm học tập</li>
                <li>• Tạo và duyệt quiz nhanh chóng</li>
                <li>• Bảng tin tương tác, phản hồi tức thì</li>
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-4 text-center text-white/90">
                <p className="text-2xl font-semibold">Quiz</p>
                <p className="text-xs text-white/70">Ôn tập mọi lúc</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 text-center text-white/90">
                <p className="text-2xl font-semibold">Chat</p>
                <p className="text-xs text-white/70">Kết nối nhanh</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4 text-center text-white/90">
                <p className="text-2xl font-semibold">Nhóm</p>
                <p className="text-xs text-white/70">Học nhóm hiệu quả</p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute right-0 top-1/2 mr-[-120px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-900/30">
            <div className="mb-8 space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                Chào mừng trở lại
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                Đăng nhập để tiếp tục học tập
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Kết nối với bạn bè, giáo viên và bài tập của bạn.
              </p>
            </div>
            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <Input
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="text-xs text-rose-600">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <label className="font-medium">Mật khẩu</label>
                  <Link
                    className="text-indigo-600 hover:underline"
                    to="/forgot-password"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password ? (
                  <p className="text-xs text-rose-600">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>
              <Button
                type="submit"
                className="w-full py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
              </Button>
            </form>
            <div className="mt-6 border-t border-slate-200 pt-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Chưa có tài khoản?{" "}
              <Link
                className="font-semibold text-indigo-600 hover:underline"
                to="/register"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
