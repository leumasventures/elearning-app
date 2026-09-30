import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login";

import StudentLayout from "./portals/student/StudentLayout";
import StudentDashboard from "./portals/student/pages/Dashboard";
import StudentCourses from "./portals/student/pages/Courses";
import StudentLessons from "./portals/student/pages/Lessons";
import StudentAssignments from "./portals/student/pages/Assignments";
import StudentCBTExams from "./portals/student/pages/CBTExams";
import StudentResults from "./portals/student/pages/Results";
import StudentBilling from "./portals/student/pages/Billing";
import StudentProfile from "./portals/student/pages/Profile";

import AdminLayout from "./portals/admin/AdminLayout";
import AdminDashboard from "./portals/admin/pages/Dashboard";
import AdminAdmissions from "./portals/admin/pages/Admissions";
import AdminStudents from "./portals/admin/pages/Students";
import AdminCourses from "./portals/admin/pages/Courses";
import AdminLecturers from "./portals/admin/pages/Lecturers";
import AdminQuestions from "./portals/admin/pages/Questions";
import AdminExams from "./portals/admin/pages/Exams";
import AdminResults from "./portals/admin/pages/Results";
import AdminTranscripts from "./portals/admin/pages/Transcripts";
import AdminCertifications from "./portals/admin/pages/Certifications";
import AdminPayments from "./portals/admin/pages/Payments";
import AdminReports from "./portals/admin/pages/Reports";
import AdminSettings from "./portals/admin/pages/Settings";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin" || user.role === "lecturer") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/student/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomeRedirect />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentLayoutBridge />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="lessons" element={<StudentLessons />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="exams" element={<StudentCBTExams />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="payments" element={<StudentBilling />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin", "lecturer"]}>
                <AdminLayoutBridge />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="admissions" element={<AdminAdmissions />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="lecturers" element={<AdminLecturers />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="transcripts" element={<AdminTranscripts />} />
            <Route path="certifications" element={<AdminCertifications />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function StudentLayoutBridge() {
  const { user } = useAuth();
  return (
    <StudentLayout
      user={{
        name: user?.name,
        tenantName: user?.tenantName || "LIN E-Learning",
        role: user?.role,
        email: user?.email,
      }}
      // If TopBar accepts onLogout, pass it:
      // onLogout={logout}
    />
  );
}

function AdminLayoutBridge() {
  const { user } = useAuth();
  return (
    <AdminLayout
      user={{
        name: user?.name,
        tenantName: user?.tenantName || "LIN E-Learning",
        role: user?.role,
        email: user?.email,
      }}
    />
  );
}