import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { getHomePath, isTeacherUser } from "@/lib/jwt";
import { useAuthStore } from "@/stores/auth-store";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export function GuestRoute({ children }: PropsWithChildren) {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to={getHomePath(token)} replace />;
  return children;
}

/** Chỉ học sinh — giáo viên bị chuyển sang /teacher */
export function StudentProtectedRoute({ children }: PropsWithChildren) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  if (isTeacherUser(token)) return <Navigate to="/teacher" replace />;
  return children;
}

/** Chỉ giáo viên/admin — học sinh bị chuyển về / */
export function TeacherProtectedRoute({ children }: PropsWithChildren) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/teacher/login" replace />;
  if (!isTeacherUser(token)) return <Navigate to="/" replace />;
  return children;
}

/** Trang login học sinh — đã đăng nhập thì về đúng trang chủ role */
export function StudentGuestRoute({ children }: PropsWithChildren) {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to={getHomePath(token)} replace />;
  return children;
}

/** Trang login giáo viên */
export function TeacherGuestRoute({ children }: PropsWithChildren) {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to={getHomePath(token)} replace />;
  return children;
}
