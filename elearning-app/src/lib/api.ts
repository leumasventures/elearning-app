const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://api.elearning.leumasitnexus.com/api"
).replace(/\/+$/, "");

const ACCESS_KEY = "lea_access_token";
const REFRESH_KEY = "lea_refresh_token";

export type Role = "student" | "admin" | "lecturer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  matric?: string | null;
  tenantName?: string | null;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  lecturerId?: string | null;
  lecturerName?: string;
  units?: number;
  duration?: string;
  certification?: string;
  status?: "Active" | "Draft";
  description?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  order: number;
  content: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  lessonsCompleted: number;
  enrolledAt: string;
  course?: Course;
  totalLessons?: number;
}

export interface Question {
  id: string;
  courseId: string;
  type: "MCQ" | "True/False";
  text: string;
  options: string[];
  correctIndex?: number;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  durationMinutes: number;
  questionIds: string[];
  startDate: string;
  status: "Scheduled" | "Active" | "Closed";
  courseCode?: string;
  questionCount?: number;
}

export interface ExamResult {
  id: string;
  userId: string;
  examId: string;
  courseId: string;
  score: number;
  total: number;
  submittedAt: string;
  student?: string;
  matric?: string | null;
  examTitle?: string;
  courseCode?: string;
  percent?: number;
}

/** Auth tokens only — SPA session. All business data lives in MySQL. */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = (await res.json()) as {
    accessToken: string;
    refreshToken?: string;
  };
  setTokens(data.accessToken, data.refreshToken || refreshToken);
  return data.accessToken;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, auth = true, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${path}`, {
        ...rest,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data as { message?: string }).message ||
      (data as { error?: string }).error ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

// ── Auth ───────────────────────────────────────────────────

export async function loginApi(payload: {
  email: string;
  password: string;
  role?: Role;
}): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
    auth: false,
  });
}

export async function meApi(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me");
}

export async function logoutApi(): Promise<void> {
  try {
    const refreshToken = getRefreshToken();
    await apiRequest("/auth/logout", {
      method: "POST",
      body: { refreshToken },
    });
  } finally {
    clearTokens();
  }
}

// ── Users (DB) ─────────────────────────────────────────────
// Backend GET /users → { count, users }

export async function getUsers(): Promise<AuthUser[]> {
  const data = await apiRequest<
    { users?: AuthUser[]; count?: number } | AuthUser[]
  >("/users");
  if (Array.isArray(data)) return data;
  return data.users ?? [];
}

export async function createUser(body: {
  name: string;
  email: string;
  password: string;
  matric?: string | null;
  role?: Role;
}): Promise<AuthUser> {
  const data = await apiRequest<{ user: AuthUser }>("/auth/register", {
    method: "POST",
    body,
    auth: true,
  });
  return data.user;
}

export async function deleteUser(id: string): Promise<void> {
  await apiRequest(`/users/${id}`, { method: "DELETE" });
}

export async function updateUser(
  id: string,
  body: Partial<Pick<AuthUser, "name" | "email" | "matric" | "role">>
): Promise<AuthUser> {
  const data = await apiRequest<{ user: AuthUser }>(`/users/${id}`, {
    method: "PUT",
    body,
  });
  return data.user;
}

// ── Courses (DB) ───────────────────────────────────────────
// Backend GET /courses → { count, courses }

export async function getCourses(): Promise<Course[]> {
  const data = await apiRequest<
    { courses?: Course[]; count?: number } | Course[]
  >("/courses");
  if (Array.isArray(data)) return data;
  return data.courses ?? [];
}

export async function getCourse(idOrCode: string): Promise<Course> {
  const data = await apiRequest<{ course: Course }>(`/courses/${idOrCode}`);
  return data.course;
}

export async function createCourse(body: {
  code: string;
  title: string;
  lecturerName?: string;
  lecturerId?: string | null;
  units?: number;
  duration?: string;
  certification?: string;
  status?: "Active" | "Draft";
  description?: string;
}): Promise<Course> {
  const data = await apiRequest<{ course: Course }>("/courses", {
    method: "POST",
    body,
  });
  return data.course;
}

export async function deleteCourse(id: string): Promise<void> {
  await apiRequest(`/courses/${id}`, { method: "DELETE" });
}

// ── Lessons (DB) ───────────────────────────────────────────

export async function getLessons(courseId?: string): Promise<Lesson[]> {
  const q = courseId ? `?courseId=${encodeURIComponent(courseId)}` : "";
  const data = await apiRequest<{ lessons?: Lesson[]; count?: number }>(
    `/lessons${q}`
  );
  return data.lessons ?? [];
}

export async function createLesson(body: {
  courseId: string;
  title: string;
  duration?: string;
  content?: string;
  order?: number;
}): Promise<Lesson> {
  const data = await apiRequest<{ lesson: Lesson }>("/lessons", {
    method: "POST",
    body,
  });
  return data.lesson;
}

export async function updateLesson(
  id: string,
  body: Partial<Pick<Lesson, "title" | "duration" | "content" | "order">>
): Promise<Lesson> {
  const data = await apiRequest<{ lesson: Lesson }>(`/lessons/${id}`, {
    method: "PUT",
    body,
  });
  return data.lesson;
}

export async function deleteLesson(id: string): Promise<void> {
  await apiRequest(`/lessons/${id}`, { method: "DELETE" });
}

// ── Enrollments (DB) ───────────────────────────────────────

export async function getEnrollments(userId?: string): Promise<Enrollment[]> {
  const q = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  const data = await apiRequest<{
    enrollments?: Enrollment[];
    count?: number;
  }>(`/enrollments${q}`);
  return data.enrollments ?? [];
}

export async function enrollInCourse(
  courseId: string,
  userId?: string
): Promise<Enrollment> {
  const data = await apiRequest<{ enrollment: Enrollment }>("/enrollments", {
    method: "POST",
    body: { courseId, ...(userId ? { userId } : {}) },
  });
  return data.enrollment;
}

export async function updateEnrollmentProgress(
  id: string,
  fields: { progress?: number; lessonsCompleted?: number }
): Promise<void> {
  await apiRequest(`/enrollments/${id}/progress`, {
    method: "PATCH",
    body: fields,
  });
}

// ── Questions (DB) ─────────────────────────────────────────

export async function getQuestions(courseId?: string): Promise<Question[]> {
  const q = courseId ? `?courseId=${encodeURIComponent(courseId)}` : "";
  const data = await apiRequest<{ questions?: Question[]; count?: number }>(
    `/questions${q}`
  );
  return data.questions ?? [];
}

export async function createQuestion(body: {
  courseId: string;
  type?: "MCQ" | "True/False";
  text: string;
  options: string[];
  correctIndex?: number;
  points?: number;
}): Promise<Question> {
  const data = await apiRequest<{ question: Question }>("/questions", {
    method: "POST",
    body,
  });
  return data.question;
}

export async function updateQuestion(
  id: string,
  body: Partial<
    Pick<Question, "text" | "options" | "correctIndex" | "points" | "type">
  >
): Promise<Question> {
  const data = await apiRequest<{ question: Question }>(`/questions/${id}`, {
    method: "PUT",
    body,
  });
  return data.question;
}

export async function deleteQuestion(id: string): Promise<void> {
  await apiRequest(`/questions/${id}`, { method: "DELETE" });
}

// ── Exams (DB) ─────────────────────────────────────────────

export async function getExams(courseId?: string): Promise<Exam[]> {
  const q = courseId ? `?courseId=${encodeURIComponent(courseId)}` : "";
  const data = await apiRequest<{ exams?: Exam[]; count?: number }>(
    `/exams${q}`
  );
  return data.exams ?? [];
}

export async function getExam(id: string): Promise<{
  exam: Exam;
  questions: Question[];
}> {
  return apiRequest(`/exams/${id}`);
}

export async function createExam(body: {
  title: string;
  courseId: string;
  durationMinutes?: number;
  questionIds?: string[];
  startDate?: string;
  status?: Exam["status"];
}): Promise<Exam> {
  const data = await apiRequest<{ exam: Exam }>("/exams", {
    method: "POST",
    body,
  });
  return data.exam;
}

export async function updateExam(
  id: string,
  body: Partial<{
    title: string;
    durationMinutes: number;
    questionIds: string[];
    startDate: string;
    status: Exam["status"];
  }>
): Promise<Exam> {
  const data = await apiRequest<{ exam: Exam }>(`/exams/${id}`, {
    method: "PUT",
    body,
  });
  return data.exam;
}

export async function deleteExam(id: string): Promise<void> {
  await apiRequest(`/exams/${id}`, { method: "DELETE" });
}

export async function submitExam(
  id: string,
  answers: Record<string, number>
): Promise<ExamResult> {
  const data = await apiRequest<{ result: ExamResult }>(`/exams/${id}/submit`, {
    method: "POST",
    body: { answers },
  });
  return data.result;
}

// ── Results (DB) ───────────────────────────────────────────

export async function getResults(filters?: {
  userId?: string;
  courseId?: string;
}): Promise<ExamResult[]> {
  const params = new URLSearchParams();
  if (filters?.userId) params.set("userId", filters.userId);
  if (filters?.courseId) params.set("courseId", filters.courseId);
  const q = params.toString() ? `?${params}` : "";
  const data = await apiRequest<{ results?: ExamResult[]; count?: number }>(
    `/results${q}`
  );
  return data.results ?? [];
}
