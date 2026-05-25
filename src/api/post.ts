// src/api/post.ts

import { http } from "@/api/http";
import type {
  ApiResponse,
  CommentResponse,
  PostResponse,
  Privacy,
  ReactionRequest,
  ReactionType,
  Slice,
  ReportStatus,
  ReportResponse,
} from "@/types/models";

//  FEED
export async function fetchFeed(
  page: number,
  size: number,
): Promise<Slice<PostResponse>> {
  const { data } = await http.get<ApiResponse<Slice<PostResponse>>>(
    "/post/feed",
    {
      params: { page, size },
    },
  );

  if (!data.result) throw new Error("Empty feed");

  return data.result;
}

//  DETAIL
export async function fetchPost(postId: number): Promise<PostResponse> {
  const { data } = await http.get<ApiResponse<PostResponse>>(`/post/${postId}`);

  if (!data.result) throw new Error("Post not found");

  return data.result;
}

//  CRUD

export async function createPost(
  payload: {
    content: string;
    privacy: Privacy;
  },
  files?: File[],
): Promise<PostResponse> {
  const fd = new FormData();

  fd.append(
    "request",
    new Blob([JSON.stringify(payload)], {
      type: "application/json",
    }),
  );

  files?.forEach((f) => fd.append("files", f));

  const { data } = await http.post<ApiResponse<PostResponse>>("/post", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!data.result) throw new Error("Create failed");

  return data.result;
}

export async function updatePost(
  postId: number,
  payload: {
    content: string;
    privacy: Privacy;
  },
): Promise<PostResponse> {
  const { data } = await http.put<ApiResponse<PostResponse>>(
    `/post/${postId}`,
    payload,
  );

  if (!data.result) throw new Error("Update failed");

  return data.result;
}

export async function deletePost(postId: number): Promise<void> {
  await http.delete(`/post/${postId}`);
}

//  REACTION

export async function reactPost(
  postId: number,
  body: ReactionRequest,
): Promise<PostResponse> {
  const { data } = await http.post<ApiResponse<PostResponse>>(
    `/post/${postId}/react`,
    body,
  );

  if (!data.result) throw new Error("React failed");

  return data.result;
}

export async function getMyReaction(
  postId: number,
): Promise<ReactionType | null> {
  const { data } = await http.get<ApiResponse<ReactionType | null>>(
    `/post/${postId}/my-reaction`,
  );

  return data.result ?? null;
}

//  COMMENT

export async function commentPost(
  postId: number,
  body: {
    parentId?: number;
    content: string;
  },
): Promise<CommentResponse> {
  const { data } = await http.post<ApiResponse<CommentResponse>>(
    `/post/${postId}/comments`,
    body,
  );

  if (!data.result) throw new Error("Comment failed");

  return data.result;
}

//  SHARE

export async function sharePost(originalPostId: number): Promise<PostResponse> {
  const { data } = await http.post<ApiResponse<PostResponse>>(
    `/post/share/${originalPostId}`,
  );

  if (!data.result) throw new Error("Share failed");

  return data.result;
}

// //  REPORT
// export async function reportPost(
//   postId: number,
//   body: {
//     reason: ReportReason;
//     description?: string;
//   },
// ): Promise<void> {
//   await http.post(`/post/${postId}/report`, body);
// }
export async function getPendingReports(): Promise<ReportResponse[]> {
  const { data } = await http.get<ApiResponse<ReportResponse[]>>(
    "/post/reports/pending",
  );

  return data.result ?? [];
}

export async function handleReport(
  reportId: number,
  status: ReportStatus,
): Promise<ReportResponse> {
  const { data } = await http.put<ApiResponse<ReportResponse>>(
    `/post/reports/${reportId}/handle`,
    null,
    {
      params: {
        status,
      },
    },
  );

  if (!data.result) {
    throw new Error("Handle report failed");
  }

  return data.result;
}
export type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "VIOLENCE"
  | "FAKE_INFORMATION"
  | "OTHER";

export async function fetchComments(
  postId: number,
): Promise<CommentResponse[]> {
  const { data } = await http.get<ApiResponse<CommentResponse[]>>(
    `/post/${postId}/comments`,
  );

  return data.result ?? [];
}

export async function deleteComment(
  postId: number,
  commentId: number,
): Promise<void> {
  await http.delete(`/post/${postId}/comments/${commentId}`);
}

export async function fetchUserPosts(
  userId: number,
  page = 0,
  size = 10,
): Promise<Slice<PostResponse>> {
  const { data } = await http.get<ApiResponse<Slice<PostResponse>>>(
    `/post/user/${userId}`,
    {
      params: { page, size },
    },
  );

  if (!data.result) {
    throw new Error("User posts empty");
  }

  return data.result;
}

export async function reportPost(
  postId: number,
  body: {
    reason: ReportReason;
    description?: string;
  },
): Promise<void> {
  await http.post(`/post/${postId}/report`, body);
}

export async function fetchAdminPosts(
  page = 0,
  size = 20,
): Promise<Slice<PostResponse>> {
  const { data } = await http.get<ApiResponse<Slice<PostResponse>>>(
    "/post/admin/all",
    {
      params: { page, size },
    },
  );

  if (!data.result) {
    throw new Error("Admin posts empty");
  }

  return data.result;
}
