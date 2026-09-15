import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import StudentLayout from "./portals/student/StudentLayout";
import StudentDashboard from "./portals/student/pages/Dashboard";
import StudentCourses from "./portals/student/pages/Courses";
import StudentLessons from "./portals/student/pages/Lessons";
import StudentAssignments from "./portals/student/pages/Assignments";
import StudentCBTExams from "./portals/student/pages/CBTExams";
import StudentResults from "./portals/student/pages/Results";
import StudentProfile from "./portals/student/pages/Profile";

import AdminLayout from "./portals/admin/AdminLayout";
import AdminDashboard from "./portals/admin/pages/Dashboard";
import AdminStudents from "./portals/admin/pages/Students";
import AdminCourses from "./portals/admin/pages/Courses";
import AdminLecturers from "./portals/admin/pages/Lecturers";
import AdminQuestions from "./portals/admin/pages/Questions";
import AdminExams from "./portals/admin/pages/Exams";
import AdminResults from "./portals/admin/pages/Results";
import AdminReports from "./portals/admin/pages/Reports";

// TODO: replace with real auth context once the backend auth flow is wired up.
const currentUser = { name: "Jane Doe", role: "student", tenantName: "SAHARCO" };

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />

        <Route path="/student" element={<StudentLayout user={currentUser} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="lessons" element={<StudentLessons />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="exams" element={<StudentCBTExams />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout user={currentUser} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="lecturers" element={<AdminLecturers />} />
          <Route path="questions" element={<AdminQuestions />} />
          <Route path="exams" element={<AdminExams />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
