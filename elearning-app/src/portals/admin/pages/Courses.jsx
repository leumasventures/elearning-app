import { useState } from "react";

export const durationOptions = ["4 Weeks", "6 Weeks", "12 Weeks", "3 Months", "6 Months", "1 Year"];
export const certificationOptions = [
  "Certificate of Completion",
  "Certificate of Proficiency",
  "Diploma",
  "Professional Certification",
  "None",
];
export const contentTypeOptions = ["Video", "PDF", "Live Class", "Link"];

const initialCourses = [
  {
    id: 1,
    code: "CSC101",
    title: "Introduction to Computer Science",
    lecturer: "Dr. A. Okoye",
    units: 3,
    duration: "12 Weeks",
    certification: "Certificate of Completion",
    students: 42,
    status: "Active",
    materials: [
      { id: 1, type: "PDF", title: "Course Outline", source: "csc101-outline.pdf" },
      { id: 2, type: "Video", title: "Week 1 - Introduction", source: "week1-intro.mp4" },
    ],
  },
  {
    id: 2,
    code: "MTH204",
    title: "Linear Algebra",
    lecturer: "Prof. B. Adeyemi",
    units: 4,
    duration: "12 Weeks",
    certification: "Certificate of Completion",
    students: 31,
    status: "Active",
    materials: [],
  },
  {
    id: 3,
    code: "ENG150",
    title: "Technical Writing",
    lecturer: "Mrs. C. Eze",
    units: 2,
    duration: "6 Weeks",
    certification: "Certificate of Proficiency",
    students: 58,
    status: "Draft",
    materials: [],
  },
  {
    id: 4,
    code: "WEBDEV-D",
    title: "Diploma in Web Development",
    lecturer: "Dr. D. Bello",
    units: 0,
    duration: "6 Months",
    certification: "Diploma",
    students: 27,
    status: "Active",
    materials: [
      {
        id: 1,
        type: "Live Class",
        title: "Cohort Kickoff Session",
        source: "https://meet.google.com/abc-defg-hij",
        scheduledAt: "2026-09-22T17:00",
      },
    ],
  },
  {
    id: 5,
    code: "CYBSEC-P",
    title: "Cybersecurity Fundamentals",
    lecturer: "Eng. K. Musa",
    units: 0,
    duration: "3 Months",
    certification: "Professional Certification",
    students: 19,
    status: "Active",
    materials: [],
  },
];

const emptyForm = {
  code: "",
  title: "",
  lecturer: "",
  units: "",
  duration: durationOptions[2],
  certification: certificationOptions[0],
  status: "Draft",
};

const emptyContentForm = {
  type: contentTypeOptions[0],
  title: "",
  source: "",
  scheduledAt: "",
};

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  Draft: "bg-amber-100 text-amber-800 ring-1 ring-amber-200/80",
  Archived: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
};

const contentTypeStyles = {
  Video: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200/80",
  PDF: "bg-rose-100 text-rose-800 ring-1 ring-rose-200/80",
  "Live Class": "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80",
  Link: "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80",
};

const contentTypeIcons = {
  Video: (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  PDF: (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  "Live Class": (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Link: (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
};

const acceptByType = {
  Video: "video/*",
  PDF: "application/pdf",
};

export default function Courses() {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const [contentCourseId, setContentCourseId] = useState(null);
  const [contentForm, setContentForm] = useState(emptyContentForm);
  const [contentError, setContentError] = useState("");

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.lecturer.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = courses.filter((c) => c.status === "Active").length;
  const draftCount = courses.filter((c) => c.status === "Draft").length;
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalMaterials = courses.reduce((sum, c) => sum + c.materials.length, 0);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(course) {
    setEditingId(course.id);
    setForm({
      code: course.code,
      title: course.title,
      lecturer: course.lecturer,
      units: String(course.units ?? ""),
      duration: course.duration,
      certification: course.certification,
      status: course.status,
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(emptyForm);
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.code.trim() || !form.title.trim() || !form.lecturer.trim()) {
      setError("Please fill in code, title, and lecturer before saving.");
      return;
    }

    if (editingId) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, ...form, units: Number(form.units) || 0 } : c
        )
      );
    } else {
      const newCourse = {
        id: Math.max(0, ...courses.map((c) => c.id)) + 1,
        ...form,
        units: Number(form.units) || 0,
        students: 0,
        materials: [],
      };
      setCourses((prev) => [newCourse, ...prev]);
    }
    closeModal();
  }

  function handleDelete(id) {
    if (confirm("Delete this course? This cannot be undone.")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  }

  const contentCourse = courses.find((c) => c.id === contentCourseId) || null;

  function openContentModal(course) {
    setContentCourseId(course.id);
    setContentForm(emptyContentForm);
    setContentError("");
  }

  function closeContentModal() {
    setContentCourseId(null);
    setContentForm(emptyContentForm);
    setContentError("");
  }

  function handleContentFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setContentForm((f) => ({ ...f, source: file.name }));
    }
  }

  function handleAddContent(e) {
    e.preventDefault();
    if (!contentForm.title.trim() || !contentForm.source.trim()) {
      setContentError(
        contentForm.type === "Video" || contentForm.type === "PDF"
          ? "Please add a title and choose a file to upload."
          : "Please add a title and a URL."
      );
      return;
    }
    if (contentForm.type === "Live Class" && !contentForm.scheduledAt) {
      setContentError("Please set a date and time for the live class.");
      return;
    }

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== contentCourseId) return c;
        const newItem = {
          id: Math.max(0, ...c.materials.map((m) => m.id)) + 1,
          type: contentForm.type,
          title: contentForm.title.trim(),
          source: contentForm.source.trim(),
          ...(contentForm.type === "Live Class" ? { scheduledAt: contentForm.scheduledAt } : {}),
        };
        return { ...c, materials: [newItem, ...c.materials] };
      })
    );
    setContentForm(emptyContentForm);
    setContentError("");
  }

  function handleRemoveContent(materialId) {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === contentCourseId
          ? { ...c, materials: c.materials.filter((m) => m.id !== materialId) }
          : c
      )
    );
  }

  const stats = [
    {
      label: "Total Courses",
      value: courses.length,
      gradient: "from-indigo-500 to-violet-600",
      soft: "bg-indigo-50 border-indigo-100 text-indigo-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: "Active",
      value: activeCount,
      gradient: "from-emerald-500 to-teal-600",
      soft: "bg-emerald-50 border-emerald-100 text-emerald-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Draft",
      value: draftCount,
      gradient: "from-amber-500 to-orange-500",
      soft: "bg-amber-50 border-amber-100 text-amber-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      label: "Enrolled Students",
      value: totalStudents,
      gradient: "from-sky-500 to-cyan-600",
      soft: "bg-sky-50 border-sky-100 text-sky-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Content Items",
      value: totalMaterials,
      gradient: "from-rose-500 to-pink-600",
      soft: "bg-rose-50 border-rose-100 text-rose-900",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-6 text-white shadow-lg shadow-indigo-200/40">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-100">Admin portal</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Courses</h1>
            <p className="mt-1 max-w-xl text-sm text-indigo-100/90">
              Manage course listings, durations, certifications, and learning materials.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Course
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`relative overflow-hidden rounded-xl border p-4 shadow-sm ${stat.soft}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium opacity-80">{stat.label}</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className={`rounded-lg bg-gradient-to-br ${stat.gradient} p-2 text-white shadow-md`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative min-w-[200px] flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, code, or lecturer..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Archived">Archived</option>
        </select>
        <p className="ml-auto text-xs font-medium text-slate-500">
          Showing <span className="text-slate-800">{filtered.length}</span> of {courses.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80">
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Course
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Lecturer
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Duration
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Certification
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Students
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Content
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No courses match your search</p>
                      <p className="text-xs text-slate-400">Try a different keyword or status filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((course) => (
                  <tr key={course.id} className="transition-colors hover:bg-indigo-50/40">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white shadow-sm">
                          {course.code.slice(0, 3)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">{course.title}</p>
                          <p className="text-xs font-medium text-indigo-600">{course.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{course.lecturer}</td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-violet-100">
                        {course.duration}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      <span className="line-clamp-1 text-xs">{course.certification}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {course.students}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => openContentModal(course)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-indigo-50 hover:text-indigo-700 hover:ring-indigo-200"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {course.materials.length} item{course.materials.length === 1 ? "" : "s"}
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[course.status]}`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <button
                          onClick={() => openContentModal(course)}
                          className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100"
                        >
                          Upload
                        </button>
                        <button
                          onClick={() => openEditModal(course)}
                          className="rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="rounded-lg px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          title="Delete"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-white">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Course" : "Add Course"}
              </h2>
              <p className="mt-0.5 text-sm text-indigo-100">
                {editingId
                  ? "Update course details and status"
                  : "Create a new course listing"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Course Code</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. CSC101"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Diploma in Web Development"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">Lecturer</label>
                <input
                  type="text"
                  value={form.lecturer}
                  onChange={(e) => setForm({ ...form, lecturer: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. Dr. A. Okoye"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Duration</label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {durationOptions.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">Credit Units</label>
                  <input
                    type="number"
                    min="0"
                    value={form.units}
                    onChange={(e) => setForm({ ...form, units: e.target.value })}
                    placeholder="0 if N/A"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Certification Awarded
                </label>
                <select
                  value={form.certification}
                  onChange={(e) => setForm({ ...form, certification: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {certificationOptions.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </form>

            <div className="flex shrink-0 justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-violet-700"
              >
                {editingId ? "Save Changes" : "Add Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Content Modal */}
      {contentCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Course Content</h2>
                  <p className="mt-0.5 text-sm text-indigo-100">
                    {contentCourse.code} · {contentCourse.title}
                  </p>
                </div>
                <button
                  onClick={closeContentModal}
                  className="rounded-lg bg-white/10 px-2.5 py-1 text-sm text-white transition hover:bg-white/20"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {/* Type selector pills */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Content Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {contentTypeOptions.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setContentForm({ ...emptyContentForm, type: t })}
                      className={[
                        "flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-medium transition",
                        contentForm.type === t
                          ? "border-indigo-300 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-500/20"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <span className={contentForm.type === t ? "text-indigo-600" : "text-slate-400"}>
                        {contentTypeIcons[t]}
                      </span>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddContent} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600">Title</label>
                  <input
                    type="text"
                    value={contentForm.title}
                    onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                    placeholder="e.g. Week 3 - Recap"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {(contentForm.type === "Video" || contentForm.type === "PDF") && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      Upload {contentForm.type === "Video" ? "video" : "PDF"} file
                    </label>
                    <input
                      type="file"
                      accept={acceptByType[contentForm.type]}
                      onChange={handleContentFileChange}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-indigo-700 focus:border-indigo-300 focus:outline-none"
                    />
                    {contentForm.source && (
                      <p className="mt-1.5 text-xs font-medium text-emerald-600">
                        Selected: {contentForm.source}
                      </p>
                    )}
                  </div>
                )}

                {contentForm.type === "Live Class" && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Meeting Link</label>
                      <input
                        type="text"
                        value={contentForm.source}
                        onChange={(e) => setContentForm({ ...contentForm, source: e.target.value })}
                        placeholder="https://meet.google.com/..."
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Date & Time</label>
                      <input
                        type="datetime-local"
                        value={contentForm.scheduledAt}
                        onChange={(e) =>
                          setContentForm({ ...contentForm, scheduledAt: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                )}

                {contentForm.type === "Link" && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600">URL</label>
                    <input
                      type="text"
                      value={contentForm.source}
                      onChange={(e) => setContentForm({ ...contentForm, source: e.target.value })}
                      placeholder="https://..."
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                )}

                {contentError && (
                  <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {contentError}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-violet-700"
                  >
                    Add to Course
                  </button>
                </div>
              </form>

              {/* Materials list */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Uploaded content ({contentCourse.materials.length})
                </h3>
                <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
                  {contentCourse.materials.length === 0 ? (
                    <li className="px-4 py-8 text-center">
                      <p className="text-sm text-slate-400">No content uploaded yet.</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Add a video, PDF, live class, or link above.
                      </p>
                    </li>
                  ) : (
                    contentCourse.materials.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-3 bg-white px-4 py-3 transition hover:bg-slate-50/80"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${contentTypeStyles[item.type]}`}
                            >
                              {contentTypeIcons[item.type]}
                              {item.type}
                            </span>
                            <span className="truncate text-sm font-medium text-slate-800">
                              {item.title}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-slate-500">
                            {item.source}
                            {item.scheduledAt
                              ? ` · ${item.scheduledAt.replace("T", " ")}`
                              : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveContent(item.id)}
                          className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}