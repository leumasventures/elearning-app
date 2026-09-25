import { useState, useRef, useEffect } from "react";

function Initials({ name }) {
  const initials = (name || "Guest")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white shadow-md shadow-indigo-200/50 ring-2 ring-white">
      {initials || "?"}
    </div>
  );
}

export default function TopBar({ user, children, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e) {
    if (e.key === "Escape") setMenuOpen(false);
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        {children /* mobile nav toggle button slots in here */}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {user?.tenantName || "LIN E-Learning"}
          </p>
        </div>
      </div>

      <div className="relative" ref={menuRef} onKeyDown={handleKeyDown}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-indigo-50/80"
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">
              {user?.name || "Guest"}
            </p>
            {user?.role && (
              <p className="text-[11px] font-medium capitalize text-slate-400">
                {user.role}
              </p>
            )}
          </div>
          <Initials name={user?.name} />
          <svg
            className={`h-4 w-4 text-slate-400 transition ${menuOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200/80 bg-white py-1 shadow-xl shadow-slate-200/50"
          >
            <div className="border-b border-slate-100 px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "Guest"}
              </p>
              {user?.email && (
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              )}
            </div>
            <a
              href="#"
              role="menuitem"
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
              onClick={() => setMenuOpen(false)}
            >
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </a>
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onLogout?.();
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}