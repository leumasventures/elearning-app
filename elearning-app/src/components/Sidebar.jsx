import { NavLink } from "react-router-dom";

export default function Sidebar({ title, items, basePath, onNavigate }) {
  const isStudent = title?.toLowerCase().includes("student");
  const portalLabel = isStudent ? "Student portal" : "Admin portal";

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white">
      {/* Brand */}
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">E-Learning</p>
            <p className="text-xs text-indigo-300">{portalLabel}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Menu
        </p>
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={`${basePath}/${item.path}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {item.icon && (
                      <span
                        className={`shrink-0 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 opacity-80 group-hover:text-slate-200 group-hover:opacity-100"
                        }`}
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer tip */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="rounded-xl bg-white/5 px-3 py-2.5">
          <p className="text-xs font-medium text-slate-300">
            {isStudent ? "Keep learning" : "Need help?"}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {isStudent
              ? "Check assignments and upcoming exams"
              : "Contact support or check docs"}
          </p>
        </div>
      </div>
    </aside>
  );
}