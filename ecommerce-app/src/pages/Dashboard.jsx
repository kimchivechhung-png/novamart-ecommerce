import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrdersByUser } from "../firebase/orders";
import { User, Mail, ShieldCheck, Package, Clock } from "lucide-react";
import Spinner from "../components/Spinner";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-primary-50 text-primary-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function Dashboard() {
  const { profile, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    getOrdersByUser(currentUser.uid)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser]);

  return (
    <div className="section py-16">
      <span className="text-xs font-semibold uppercase tracking-widest text-primary">My account</span>
      <h1 className="mt-2 text-3xl font-bold">Hi, {profile?.name?.split(" ")[0] || "there"} 👋</h1>
      <p className="mt-2 text-ink/60">Here's a snapshot of your NovaMart account.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600">
            <User size={18} />
          </span>
          <p className="mt-4 text-xs uppercase tracking-wide text-ink/40">Name</p>
          <p className="font-semibold">{profile?.name || "—"}</p>
        </div>
        <div className="card p-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600">
            <Mail size={18} />
          </span>
          <p className="mt-4 text-xs uppercase tracking-wide text-ink/40">Email</p>
          <p className="font-semibold">{currentUser?.email}</p>
        </div>
        <div className="card p-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600">
            <ShieldCheck size={18} />
          </span>
          <p className="mt-4 text-xs uppercase tracking-wide text-ink/40">Role</p>
          <p className="font-semibold capitalize">{profile?.role || "customer"}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-semibold">Order history</h2>
        {loading ? (
          <Spinner label="Loading orders..." />
        ) : orders.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 p-12 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-600">
              <Package size={22} />
            </span>
            <p className="font-semibold">No orders yet</p>
            <p className="max-w-sm text-sm text-ink/60">
              Once you place an order it'll show up here with live status updates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-ink/40">Order #{o.id.slice(0, 8)}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/40">
                      <Clock size={12} />
                      {o.createdAt?.toDate ? o.createdAt.toDate().toLocaleString() : "Just now"}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[o.status] || "bg-ink/5 text-ink/60"}`}>
                    {o.status}
                  </span>
                </div>
                <div className="mt-4 divide-y divide-ink/8 text-sm">
                  {o.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1.5">
                      <span className="text-ink/70">{item.quantity} × {item.name}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 text-sm font-semibold">
                  <span>Total</span>
                  <span className="text-primary-600">${Number(o.total).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

