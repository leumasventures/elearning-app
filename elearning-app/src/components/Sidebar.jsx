import { NavLink } from "react-router-dom";

export default function Sidebar({ title, items, basePath, onNavigate }) {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white h-full flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200">
        <p className="text-sm font-medium text-slate-900">{title}</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={`${basePath}/${item.path}`}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {item.icon && (
                  <span
                    className={
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}