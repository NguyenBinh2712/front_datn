import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StudentDashboardLayout } from "@/components/layout/student-dashboard-layout";
import { TeacherDashboardLayout } from "@/components/layout/teacher-dashboard-layout";
import { AdminDashboardPage } from "@/pages/admin/admin-dashboard-page";
import { AdminQuizzesPage } from "@/pages/admin/admin-quizzes-page";
import { AdminUsersPage } from "@/pages/admin/admin-users-page";
import { AdminPostsPage } from "@/pages/admin/admin-posts-page";
import { AdminGroupsPage } from "@/pages/admin/admin-groups-page";
import { DashboardHomePage } from "@/pages/dashboard/home-page";
import { ForgotPasswordPage } from "@/pages/auth/forgot-password-page";
import { LoginPage } from "@/pages/auth/login-page";
import { TeacherLoginPage } from "@/pages/auth/teacher-login-page";
import { RegisterPage } from "@/pages/auth/register-page";
import { VerifyOtpPage } from "@/pages/auth/verify-otp-page";
import { ChatPage } from "@/pages/chat/chat-page";
import { FeedPage } from "@/pages/feed/feed-page";
import { FriendsPage } from "@/pages/friends/friends-page";
import StudentGroupDetailPage from "@/pages/groups/student/student-group-detail-page";
import StudentGroupsPage from "@/pages/groups/student/student-groups-page";
import TeacherGroupDetailPage from "@/pages/groups/teacher/teacher-group-detail-page";
import TeacherGroupsPage from "@/pages/groups/teacher/teacher-groups-page";
import { NotificationsPage } from "@/pages/notifications/notifications-page";
import { PostDetailPage } from "@/pages/posts/post-detail-page";
import { ProfilePage } from "@/pages/profile/profile-page";
import { QuizCreatePage } from "@/pages/quiz/quiz-create-page";
import { QuizListPage } from "@/pages/quiz/quiz-list-page";
import { QuizResultPage } from "@/pages/quiz/quiz-result-page";
import { QuizSubmissionDetailPage } from "@/pages/quiz/quiz-submission-detail-page";
import { QuizSubmissionsPage } from "@/pages/quiz/quiz-submissions-page";
import { QuizTakePage } from "@/pages/quiz/quiz-take-page";
import { UserLookupPage } from "@/pages/users/user-lookup-page";
import { UserPublicProfilePage } from "@/pages/users/user-public-profile-page";
import {
  GuestRoute,
  StudentGuestRoute,
  StudentProtectedRoute,
  TeacherGuestRoute,
  TeacherProtectedRoute,
} from "@/routes/guards";
import { RoleRoute } from "@/routes/role-route";

const studentRoutes = [
  { index: true, element: <DashboardHomePage /> },
  { path: "feed", element: <FeedPage /> },
  { path: "friends", element: <FriendsPage /> },
  { path: "notifications", element: <NotificationsPage /> },
  { path: "profile", element: <ProfilePage /> },
  { path: "users", element: <UserLookupPage /> },
  { path: "users/:userId", element: <UserPublicProfilePage /> },
  { path: "posts/:postId", element: <PostDetailPage /> },
  { path: "chat", element: <ChatPage /> },
  { path: "chat/:convId", element: <ChatPage /> },
  { path: "quiz", element: <QuizListPage /> },
  { path: "quiz/:quizId/take", element: <QuizTakePage /> },
  { path: "quiz/result/:attemptId", element: <QuizResultPage /> },
  { path: "groups", element: <StudentGroupsPage /> },
  { path: "groups/:groupId", element: <StudentGroupDetailPage /> },
];

const teacherRoutes = [
  { index: true, element: <DashboardHomePage /> },
  { path: "feed", element: <FeedPage /> },
  { path: "friends", element: <FriendsPage /> },
  { path: "notifications", element: <NotificationsPage /> },
  { path: "profile", element: <ProfilePage /> },
  { path: "users", element: <UserLookupPage /> },
  { path: "users/:userId", element: <UserPublicProfilePage /> },
  { path: "posts/:postId", element: <PostDetailPage /> },
  { path: "chat", element: <ChatPage /> },
  { path: "chat/:convId", element: <ChatPage /> },
  { path: "quiz", element: <QuizListPage /> },
  {
    path: "quiz/create",
    element: (
      <RoleRoute role="TEACHER" fallback="/teacher">
        <QuizCreatePage />
      </RoleRoute>
    ),
  },
  {
    path: "quiz/:quizId/submissions",
    element: (
      <RoleRoute role="TEACHER" fallback="/teacher">
        <QuizSubmissionsPage />
      </RoleRoute>
    ),
  },
  {
    path: "quiz/submissions/:attemptId",
    element: (
      <RoleRoute role="TEACHER" fallback="/teacher">
        <QuizSubmissionDetailPage />
      </RoleRoute>
    ),
  },
  { path: "groups", element: <TeacherGroupsPage /> },
  { path: "groups/:groupId", element: <TeacherGroupDetailPage /> },
  {
    path: "admin",
    element: (
      <RoleRoute role="ADMIN" fallback="/teacher">
        <AdminDashboardPage />
      </RoleRoute>
    ),
  },
  {
    path: "admin/quizzes",
    element: (
      <RoleRoute role="ADMIN" fallback="/teacher">
        <AdminQuizzesPage />
      </RoleRoute>
    ),
  },
  {
    path: "admin/users",
    element: (
      <RoleRoute role="ADMIN" fallback="/teacher">
        <AdminUsersPage />
      </RoleRoute>
    ),
  },
  {
    path: "admin/posts",
    element: (
      <RoleRoute role="ADMIN" fallback="/teacher">
        <AdminPostsPage />
      </RoleRoute>
    ),
  },
  {
    path: "admin/groups",
    element: (
      <RoleRoute role="ADMIN" fallback="/teacher">
        <AdminGroupsPage />
      </RoleRoute>
    ),
  },
];

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <StudentGuestRoute>
        <LoginPage />
      </StudentGuestRoute>
    ),
  },
  {
    path: "/teacher/login",
    element: (
      <TeacherGuestRoute>
        <TeacherLoginPage />
      </TeacherGuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: "/register/verify",
    element: (
      <GuestRoute>
        <VerifyOtpPage />
      </GuestRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <GuestRoute>
        <ForgotPasswordPage />
      </GuestRoute>
    ),
  },
  {
    path: "/",
    element: (
      <StudentProtectedRoute>
        <StudentDashboardLayout />
      </StudentProtectedRoute>
    ),
    children: studentRoutes,
  },
  {
    path: "/teacher",
    element: (
      <TeacherProtectedRoute>
        <TeacherDashboardLayout />
      </TeacherProtectedRoute>
    ),
    children: teacherRoutes,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
