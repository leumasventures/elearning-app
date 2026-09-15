import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

const NAV_ITEMS = [
  { label: "Dashboard", path: "dashboard" },
  { label: "Students", path: "students" },
  { label: "Courses", path: "courses" },
  { label: "Lecturers", path: "lecturers" },
  { label: "Questions", path: "questions" },
  { label: "Exams", path: "exams" },
  { label: "Results", path: "results" },
  { label: "Reports", path: "reports" },
];

export default function AdminLayout({ user }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  const activeItem = NAV_ITEMS.find((item) =>
    location.pathname.includes(`/admin/${item.path}`)
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar title="Admin portal" items={NAV_ITEMS} basePath="/admin" />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-50 h-full w-64">
            <Sidebar title="Admin portal" items={NAV_ITEMS} basePath="/admin" />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar user={user}>
          <button
            onClick={() => setMobileNavOpen(true)}
            className="mr-3 rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </TopBar>

        <div className="border-b border-slate-200 bg-white px-6 py-3">
          <p className="text-xs text-slate-400">Admin portal</p>
          <h1 className="text-lg font-medium text-slate-900">
            {activeItem?.label ?? "Dashboard"}
          </h1>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}