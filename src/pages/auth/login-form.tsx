import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { login } from "@/api/auth";
import { getMe } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isTeacherUser } from "@/lib/jwt";
import { useAuthStore } from "@/stores/auth-store";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Tối thiểu 6 ký tự"),
});

type FormValues = z.infer<typeof schema>;

type LoginFormProps = {
  mode: "student" | "teacher";
};

export function LoginForm({ mode }: LoginFormProps) {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const isTeacherLogin = mode === "teacher";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    const token = await login(values);
    const teacherAccount = isTeacherUser(token);

    if (isTeacherLogin && !teacherAccount) {
      alert("Đây là tài khoản học sinh. Vui lòng đăng nhập tại trang học sinh.");
      return;
    }

    if (!isTeacherLogin && teacherAccount) {
      alert("Đây là tài khoản giáo viên. Vui lòng đăng nhập tại trang giáo viên.");
      return;
    }

    setToken(token);
    try {
      const me = await getMe();
      setUser({
        id: String(me.id),
        username: me.profile?.fullName ?? me.email,
        email: me.email,
      });
    } catch {
      /* getMe optional — useCurrentUserId vẫn fallback qua /user/me query */
    }
    navigate(isTeacherLogin ? "/teacher" : "/", { replace: true });
  }

  const gradient = isTeacherLogin
    ? "from-emerald-600 via-teal-600 to-cyan-500 shadow-emerald-500/20"
    : "from-indigo-600 via-violet-600 to-cyan-500 shadow-indigo-500/20";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br p-10 text-white shadow-2xl ${gradient}`}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-3xl bg-white/10 px-4 py-3 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/20 text-2xl font-bold text-white">
                {isTeacherLogin ? "GV" : "HS"}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/80">
                  DATN Hub
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {isTeacherLogin
                    ? "Khu vực giáo viên"
                    : "Khu vực học sinh"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold leading-tight tracking-tight">
                {isTeacherLogin
                  ? "Quản lý lớp học & nhóm"
                  : "Học cùng nhau. Tiến xa hơn."}
              </h1>
              <p className="max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                {isTeacherLogin
                  ? "Tạo quiz, quản lý nhóm học tập và duyệt yêu cầu tham gia của học sinh."
                  : "Tham gia quiz, kết nối bạn bè và tham gia nhóm học tập."}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/30 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-900/30">
            <div className="mb-8 space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                {isTeacherLogin ? "Giáo viên" : "Học sinh"}
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                Đăng nhập
              </h1>
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
                  <p className="text-xs text-rose-600">{errors.email.message}</p>
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
                className={`w-full py-3 ${isTeacherLogin ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
              </Button>
            </form>
            <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {isTeacherLogin ? (
                <p>
                  Bạn là học sinh?{" "}
                  <Link
                    className="font-semibold text-indigo-600 hover:underline"
                    to="/login"
                  >
                    Đăng nhập học sinh
                  </Link>
                </p>
              ) : (
                <p>
                  Bạn là giáo viên?{" "}
                  <Link
                    className="font-semibold text-emerald-600 hover:underline"
                    to="/teacher/login"
                  >
                    Đăng nhập giáo viên
                  </Link>
                </p>
              )}
              <p>
                Chưa có tài khoản?{" "}
                <Link
                  className="font-semibold text-indigo-600 hover:underline"
                  to="/register"
                >
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
