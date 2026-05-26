export type ApiResponse<T> = {
  code: number;
  message?: string;
  result?: T;
};

export type Slice<T> = {
  content: T[];
  number: number;
  size: number;
  last: boolean;
  first?: boolean;
  empty?: boolean;
};

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
  first: boolean;
};

/*
 * ENUMS
 */

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type Privacy = "PUBLIC" | "FRIENDS" | "PRIVATE";

export type PostType = "TEXT" | "MEDIA" | "SHARED";

export type ReactionType = "LIKE" | "LOVE" | "HAHA" | "WOW" | "SAD" | "ANGRY";

export type MessageStatus = "SENT" | "DELIVERED" | "READ";

export type TypeEvent =
  | "NOTIFICATION"
  | "MESSAGE"
  | "TYPING"
  | "SEEN"
  | "JOIN"
  | "LEAVE"
  | "EDIT"
  | "DELETE"
  | "REACTION";

export type GroupPrivacy = "PUBLIC" | "PRIVATE";

export type MembershipRole = "OWNER" | "MODERATOR" | "MEMBER";

export type JoinRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ReportReason =
  | "SPAM"
  | "VIOLENCE"
  | "HARASSMENT"
  | "FAKE_INFORMATION";

export type ReportStatus = "PENDING" | "APPROVED" | "REJECTED";

export type QuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "SHORT_TEXT";

export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "GRADED";

export type NotificationType = string;
export type TargetType = string;
export type ChatReportType = string;
export type OtpType = string;
export type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "FILE";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export enum QuizStatus {
  GROUP = "GROUP",
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
}

//active
export type OtpRequest = {
  email: string;
  otp: string;
};

export type OtpResponse = {
  otp: string;
  createAt: string;
  exp: string;
};

export type ResendOtpRequest = {
  email: string;
  type: OtpType;
};

//auth
export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
};

export type IntrospectRequest = {
  token: string;
};

export type IntrospectResponse = {
  authenticated: boolean;
};

export type LogoutRequest = {
  token: string;
};

export type RefreshRequest = {
  token: string;
};

//user
export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type ForgotPasswordRequest = {
  email: string;
  otp: string;
  newPassword: string;
};

export type ProfileRequest = {
  fullName?: string;
  bio?: string;
  avatar?: string;
  avatarPublicId?: string;
  birth?: string;
  gender?: Gender;
};

export type ProfileResponse = {
  id?: number;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  birth?: string;
  gender?: Gender;
};

export type UserCreateRequest = {
  email: string;
  password: string;
};

export type UserResponse = {
  id: number;
  email: string;
  status: boolean;
  createAt?: string;
  profile?: ProfileResponse;
};

//cloud
export type CloudinaryResponse = {
  url: string;
  publicId: string;
};

export type Medias = {
  url?: string;
  publicId?: string;
  thumbnail?: string;
  duration?: number;
  mediaType?: MediaType;
  sortOrder?: number;
};

//friend
export type FriendRequest = {
  targetUserId: number;
};

export type FriendResponse = {
  friendshipId: number;
  userId: number;
  fullName: string;
  since: string;
};

export type FriendshipStatus = {
  status: string;
};

export type RecommendUser = {
  userId: number;
  email: string;
  mutualFriendsCount?: number;
  isTeacher?: boolean;
  createAt?: string;
  reason?: string;
};

//group
export type GroupCreateRequest = {
  name: string;
  description?: string;
  coverImageUrl?: string;
  privacy: GroupPrivacy;
  subjectCode?: string[];
};

export type GroupUpdateRequest = {
  name?: string;
  description?: string;
  coverImageUrl?: string;
  privacy?: GroupPrivacy;
};

export type ChangeRoleRequest = {
  newRole: MembershipRole;
};

export type InviteRequest = {
  friendId: number;
};

export type GroupResponse = {
  id: number;
  name: string;
  description?: string;
  coverImageUrl?: string;
  privacy: GroupPrivacy;
  ownerId: number;
  ownerName: string;
  memberCount: number;
  createdAt: string;
};

export type GroupMemberResponse = {
  userId: number;
  fullName: string;
  role: MembershipRole;
  joinedAt: string;
};

export type JoinRequestResponse = {
  id: number;
  groupId?: number;
  userId: number;
  userName: string;
  inviterId: number;
  inviterName: string;
  status: JoinRequestStatus;
  requestedAt: string;
  reviewedAt?: string;
};

//post
export type UserPost = {
  id: number;
  fullName: string;
  urlAvatar: string;
};

export type PostCreateRequest = {
  content?: string;
  privacy?: Privacy;
  groupId?: number;
  originalPostId?: number;
};

export type PostMediaDto = {
  id?: number;
  mediaType?: MediaType;
  url?: string;
  thumbnail?: string;
  duration?: number;
  sortOrder?: number;
};

export type CommentRequest = {
  parentId?: number;
  content: string;
};

export type CommentResponse = {
  id: number;
  userId: number;
  content: string;
  parentId?: number;
  createdAt?: string;
};

export type ReactionRequest = {
  type: ReactionType;
};

export type ReactionResponse = {
  type: ReactionType;
  userId: number;
};

export type PostResponse = {
  id: number;
  user: UserPost;
  content: string;
  privacy: Privacy;
  postType: PostType;
  originalPostId?: number;
  comments?: CommentResponse[];
  medias?: PostMediaDto[];
  reactions?: Partial<Record<ReactionType, number>>;
  commentCount?: number;
  isHidden?: boolean;
  createdAt?: string;
};

export type ReportRequest = {
  reason: ReportReason;
  description?: string;
};

export type ReportResponse = {
  id: number;
  postId: number;
  reporterId: number;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  reportedAt: string;
};

export type AdminPostItemResponse = {
  id: number;
  user: UserPost;
  authorName: string;
  authorAvatar: string;
  content: string;
  privacy: Privacy;
  reportCount: number;
  createdAt: string;
};

//chat
export type BlockRequest = {
  userId: number;
};

export type ChangeMember = {
  conversationId: number;
  memberId: number;
};

export type CreateChatGroup = {
  name: string;
  memberId: number[];
};

export type DeleteRequest = {
  messageId: string;
  deleteForAll: boolean;
};

export type EditMessageRequest = {
  content: string;
};

export type ParticipantInfo = {
  userId: number;
  fullName: string;
  avtUrl?: string;
  isOnline: boolean;
  lastReadAt?: string;
};

export type ConversationResponse = {
  id: number;
  name?: string;
  avatarUrl?: string;
  isGroup: boolean;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isPending: boolean;
  participants?: ParticipantInfo[];
};

export type MessageMedia = {
  url?: string;
  type?: string;
};

export type MessageRequest = {
  conversationId: number;
  content?: string;
  files?: File[];
  type?: MediaType;
};

export type MessageResponse = {
  id: string;
  conversationId: number;
  senderId: number;
  content: string;
  messageMedias?: MessageMedia[];
  timestamp: string;
  status: MessageStatus;
  seenBy?: number[];
  isPending: boolean;
  isEdited: boolean;
};

export type ReactionMessageRequest = {
  messageId: string;
  type: ReactionType;
};

export type ChatReportRequest = {
  convId: number;
  type: ChatReportType;
  reason: string;
};

export type SendMessageRequest = {
  conversationId?: number;
  targetUserId?: number;
  content: string;
};

export type ReplyMessage = {
  parentMessageId: string;
  sendRequest: SendMessageRequest;
};

export type SearchRequest = {
  keyword: string;
  page?: number;
  size?: number;
};

export type TypingRequest = {
  conversationId: number;
  isTyping: boolean;
};

export type UpdateMessage = {
  messageId: string;
  contentNew: string;
};

export type WsDeleteMessageRequest = {
  messageId: string;
};

export type WsEditMessageRequest = {
  messageId: string;
  content: string;
};

export type ChatEvent<T = unknown> = {
  type: TypeEvent;
  conversationId: number;
  userId: number;
  messageId: string | null;
  payload: T;
};

export type EventRequest = {
  type: TypeEvent;
  conversationId: number;
  userId: number;
  messages: unknown;
};

export type PresencePayload = {
  userId: number;
  status: "ONLINE" | "OFFLINE";
};

//notify
export type NotificationResponse = {
  id: string;
  actorId: number;
  type: NotificationType;
  targetType: TargetType;
  targetId: string;
  content: string;
  isRead: boolean;
  createAt: string;
};

//quiz
export type OptionRequest = {
  text: string;
  isCorrect: boolean;
};

export type OptionResponse = {
  index: number;
  text: string;
};

export type QuestionRequest = {
  questionText: string;
  type: QuestionType;
  point?: number;
  order?: number;
  explanation?: string;
  options?: OptionRequest[];
};

export type QuestionResponse = {
  id: string;
  questionText: string;
  type: QuestionType;
  points?: number;
  mediaUrl?: string;
  explanation?: string;
  options?: OptionResponse[];
};

export type QuizCreateRequest = {
  userId: number;
  groupId: number;
  title: string;
  description?: string;
  status: QuizStatus;
  time?: number;
  maxAttempt?: number;
  startAt?: string;
  endAt?: string;
  allowAiReview?: boolean;
  questions: unknown[];
};

export type QuizResponse = {
  id: number;
  title: string;
  description?: string;
  status: QuizStatus;
  time?: number;
  maxAttempts?: number;
  startAt?: string;
  endAt?: string;
  createdAt?: string;
  note?: string;
  creatorId?: number;
  creatorName?: string;
};

export type QuizDetailResponse = {
  id: number;
  title: string;
  description?: string;
  time?: number;
  maxAttempts?: number;
  allowAiReview?: boolean;
  startAt?: string;
  endAt?: string;
  questions: QuestionResponse[];
};

export type ReviewQuizRequest = {
  approved: boolean;
  note?: string;
};

export type ApproveQuiz = {
  approved: boolean;
  note?: string;
};

export type AnswerRequest = {
  questionId: string;
  selectedOptionIndexes?: number[];
  textAnswer?: string;
};

export type AnswerResponse = {
  questionId: string;
  questionText?: string;
  selectedOptionIndexes?: number[];
  textAnswer?: string;
  isCorrect?: boolean;
  pointsEarned?: number;
  maxPoints?: number;
  explanation?: string;
};

export type FeedbackResponse = {
  id: number;
  teacherId: number;
  teacherName: string;
  teacherAvatar?: string;
  questionId?: string;
  content: string;
  createdAt?: string;
};

export type AttemptResponse = {
  attemptId: number;
  studentId?: number;
  studentName?: string;
  studentAvatar?: string;
  attemptNumber?: number;
  status: AttemptStatus;
  score?: number;
  scorePercent?: number;
  totalPoints?: number;
  submittedAt?: string;
  aiReview?: boolean;
  bestScore?: number;
  canRetake?: boolean;
  feedbacks?: FeedbackResponse[];
  answers?: AnswerResponse[];
};

export type StudentAttemptResponse = {
  attemptId: number;
  userId: number;
  studentName: string;
  studentAvatar?: string;
  attemptNumber?: number;
  status: AttemptStatus;
  score?: number;
  scorePercent?: number;
  submittedAt?: string;
  aiReviewRequested?: boolean;
  answers?: AnswerResponse[];
  feedbacks?: FeedbackResponse[];
};

export type SubmitAttemptRequest = {
  attemptId: number;
  answers: AnswerRequest[];
};

export type TeacherFeedbackRequest = {
  attemptId: number;
  questionId?: string;
  content: string;
};

export type QuestionAnalysisResponse = {
  questionIndex: number;
  questionText: string;
  analysis: string;
  correctApproach: string;
};

export type AiReviewResponse = {
  overallAnalysis?: string;
  weaknessAreas?: string[];
  studyRoadmap?: string;
  perQuestion?: QuestionAnalysisResponse[];
  generatedAt?: string;
};

export type QuizStartResult = {
  attemptId: number;
  quiz: QuizDetailResponse;
  serverDeadline: string;
};

//role
export type RoleRequest = {
  name: string;
};

export type RoleResponse = {
  id: number;
  name: string;
};

//teacher
export type TeacherRequest = {
  reason: string;
  idCardFront?: File;
  idCardBack?: File;
  degrees?: File[];
  cv?: File;
  subject?: string[];
};

export type TeacherResponse = {
  id: number;
  applicantId: number;
  applicantEmail: string;
  reason: string;
  idCardFrontUrl?: string;
  idCardBackUrl?: string;
  degreeUrlsJson?: string;
  cvUrl?: string;
  status: ApplicationStatus;
  appliedAt?: string;
  reviewedAt?: string;
  reviewNote?: string;
};

export type ReviewRequest = {
  status: ApplicationStatus;
  reviewNote?: string;
};

//search
export type SearchResultResponse = {
  users?: UserResponse[];
  posts?: PostResponse[];
  groups?: GroupResponse[];
};
