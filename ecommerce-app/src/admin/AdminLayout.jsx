import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquare,
  ShoppingBag,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout() {
  const { profile } = useAuth();

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink/10 bg-white md:flex">
        <Link to="/" className="flex items-center gap-2 px-6 py-6 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">
            <ShoppingBag size={16} />
          </span>
          NovaMart
        </Link>
        <nav className="flex-1 space-y-1 px-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-primary text-white" : "text-ink/60 hover:bg-primary-50 hover:text-primary-600"
                }`
              }
            >
              <l.icon size={17} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-ink/10 p-4">
          <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/60 hover:bg-primary-50 hover:text-primary-600">
            <ArrowLeft size={16} /> Back to site
          </Link>
          <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {profile?.name?.[0]?.toUpperCase() || "A"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{profile?.name}</p>
              <p className="text-xs text-ink/40">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="flex min-w-0 items-center justify-between border-b border-ink/10 bg-white px-4 py-3 md:hidden">
          <Link to="/" className="flex items-center gap-2 font-display text-base font-bold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-white">
              <ShoppingBag size={14} />
            </span>
            NovaMart Admin
          </Link>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-ink/10 bg-white px-3 py-2 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                  isActive ? "bg-primary text-white" : "text-ink/60"
                }`
              }
            >
              <l.icon size={14} /> {l.label}
            </NavLink>
          ))}
        </div>

        <main className="min-w-0 p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
