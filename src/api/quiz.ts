import { http } from "@/api/http";
import type {
  AiReviewResponse,
  AnswerRequest,
  ApiResponse,
  AttemptResponse,
  Page,
  QuizResponse,
  QuizStartResult,
  Slice,
} from "@/types/models";

export type QuizCreatePayload = {
  groupId?: number | null;
  title: string;
  description?: string;
  time: number;
  maxAttempt: number;
  startAt?: string | null;
  endAt?: string | null;
  allowAiReview: boolean;
  questions: Array<{
    id?: string;
    questionText: string;
    type: string;
    point: number;
    order: number;
    explanation?: string;
    options?: Array<{ text: string; isCorrect: boolean }>;
  }>;
};

//  PUBLIC

export async function fetchPublicQuizzes(
  page: number,
  size: number,
): Promise<Slice<QuizResponse>> {
  const { data } = await http.get<ApiResponse<Slice<QuizResponse>>>(
    "/test/public",
    { params: { page, size } },
  );
  if (!data.result) throw new Error("Empty quiz list");
  return data.result;
}

export async function fetchGroupQuizzes(
  groupId: number,
): Promise<QuizResponse[]> {
  const { data } = await http.get<ApiResponse<QuizResponse[]>>(
    `/test/group/${groupId}`,
  );
  return data.result ?? [];
}

//  TEACHER

export async function createQuizTeacher(
  body: QuizCreatePayload,
): Promise<QuizResponse> {
  const { data } = await http.post<ApiResponse<QuizResponse>>("/test", body);
  if (!data.result) throw new Error("Create quiz failed");
  return data.result;
}

export async function updateQuizTeacher(
  quizId: number,
  body: QuizCreatePayload,
): Promise<QuizResponse> {
  const { data } = await http.put<ApiResponse<QuizResponse>>(
    `/test/${quizId}`,
    body,
  );
  if (!data.result) throw new Error("Update quiz failed");
  return data.result;
}

/** Kích hoạt quiz nhóm (GROUP → ACTIVE). */
export async function activateGroupQuiz(quizId: number): Promise<QuizResponse> {
  const { data } = await http.post<ApiResponse<QuizResponse>>(
    `/test/${quizId}/activate`,
  );
  if (!data.result) throw new Error("Activate failed");
  return data.result;
}

export async function fetchMyQuizzes(): Promise<QuizResponse[]> {
  const { data } =
    await http.get<ApiResponse<QuizResponse[]>>("/test/my-quizzes");
  return data.result ?? [];
}

export async function teacherSubmissions(
  quizId: number,
  page: number,
  size: number,
): Promise<Page<AttemptResponse>> {
  const { data } = await http.get<ApiResponse<Page<AttemptResponse>>>(
    `/test/${quizId}/submissions`,
    { params: { page, size } },
  );
  if (!data.result) throw new Error("No submissions");
  return data.result;
}

export async function submissionDetail(
  attemptId: number,
): Promise<AttemptResponse> {
  const { data } = await http.get<ApiResponse<AttemptResponse>>(
    `/test/submissions/${attemptId}`,
  );
  if (!data.result) throw new Error("No submission");
  return data.result;
}

export async function teacherFeedback(
  attemptId: number,
  body: { questionId?: string | null; content: string },
): Promise<void> {
  await http.post(`/test/submissions/${attemptId}/feedback`, body);
}

//  STUDENT

export async function startQuiz(quizId: number): Promise<QuizStartResult> {
  const { data } = await http.post<ApiResponse<QuizStartResult>>(
    `/test/${quizId}/start`,
  );
  if (!data.result) throw new Error("Cannot start quiz");
  return data.result;
}

export async function submitAttempt(
  attemptId: number,
  answers: AnswerRequest[],
): Promise<AttemptResponse> {
  const { data } = await http.post<ApiResponse<AttemptResponse>>(
    `/test/attempts/${attemptId}/submit`,
    answers,
  );
  if (!data.result) throw new Error("Submit failed");
  return data.result;
}

export async function aiReviewAttempt(
  attemptId: number,
): Promise<AiReviewResponse> {
  const { data } = await http.post<ApiResponse<AiReviewResponse>>(
    `/test/attempts/${attemptId}/ai-review`,
  );
  if (!data.result) throw new Error("AI review failed");
  return data.result;
}

export async function myAttempts(quizId: number): Promise<AttemptResponse[]> {
  const { data } = await http.get<ApiResponse<AttemptResponse[]>>(
    `/test/${quizId}/my-attempts`,
  );
  return data.result ?? [];
}

//  ADMIN

export async function pendingQuizzes(
  page: number,
  size: number,
): Promise<Page<QuizResponse>> {
  const { data } = await http.get<ApiResponse<Page<QuizResponse>>>(
    "/test/pending",
    { params: { page, size } },
  );
  if (!data.result) throw new Error("Empty");
  return data.result;
}

export async function adminReviewQuiz(
  quizId: number,
  approved: boolean,
  note?: string,
): Promise<QuizResponse> {
  const { data } = await http.post<ApiResponse<QuizResponse>>(
    `/test/${quizId}/review`,
    { approved, note },
  );
  if (!data.result) throw new Error("Review failed");
  return data.result;
}
