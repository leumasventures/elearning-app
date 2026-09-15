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
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
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
    <header className="h-14 shrink-0 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      <div className="flex items-center">
        {children /* mobile nav toggle button slots in here */}
        <span className="text-sm text-slate-500">
          {user?.tenantName || "LIN E-Learning"}
        </span>
      </div>

      <div className="relative" ref={menuRef} onKeyDown={handleKeyDown}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-slate-100"
        >
          <span className="text-sm text-slate-700">{user?.name || "Guest"}</span>
          <Initials name={user?.name} />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 z-10 mt-2 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
          >
            
              <a href="#"
              role="menuitem"
              className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </a>
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onLogout?.();
              }}
              className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}