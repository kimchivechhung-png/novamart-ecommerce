import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function AuthLayout({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-10 text-paper md:flex">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">
            <ShoppingBag size={16} />
          </span>
          NovaMart
        </Link>
        <div>
          <p className="font-display text-3xl font-bold leading-tight">
            Good tech, honestly priced, delivered fast.
          </p>
          <p className="mt-4 max-w-sm text-paper/50">
            Sign in to track orders, save favorites, and check out faster next time.
          </p>
        </div>
        <p className="text-xs text-paper/30">© {new Date().getFullYear()} NovaMart</p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 font-display text-lg font-bold md:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">
              <ShoppingBag size={16} />
            </span>
            NovaMart
          </Link>
          {Icon && (
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-600">
              <Icon size={20} />
            </span>
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink/60">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
