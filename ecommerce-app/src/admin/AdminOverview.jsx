import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Users, MessageSquare, ClipboardList, ArrowUpRight } from "lucide-react";
import { getProducts } from "../firebase/products";
import { getUsers } from "../firebase/users";
import { getMessages } from "../firebase/messages";
import { getAllOrders } from "../firebase/orders";
import Spinner from "../components/Spinner";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      const [products, users, messages, orders] = await Promise.all([
        getProducts(),
        getUsers(),
        getMessages(),
        getAllOrders(),
      ]);
      const revenue = orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      setStats({
        products: products.length,
        users: users.length,
        messages: messages.length,
        unread: messages.filter((m) => !m.read).length,
        orders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        revenue,
        recentProducts: products.slice(0, 5),
      });
    }
    load();
  }, []);

  if (!stats) return <Spinner label="Loading dashboard..." />;

  const cards = [
    { label: "Products", value: stats.products, icon: Package, to: "/admin/products" },
    { label: "Orders", value: stats.orders, sub: `${stats.pendingOrders} pending`, icon: ClipboardList, to: "/admin/orders" },
    { label: "Registered users", value: stats.users, icon: Users, to: "/admin/users" },
    { label: "Messages", value: stats.messages, sub: `${stats.unread} unread`, icon: MessageSquare, to: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-ink/60">
        A quick look at how the store is doing. Revenue so far: <span className="font-semibold text-primary-600">${stats.revenue.toFixed(2)}</span>
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link to={c.to} key={c.label} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600">
                <c.icon size={18} />
              </span>
              <ArrowUpRight size={16} className="text-ink/20" />
            </div>
            <p className="mt-4 font-display text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-ink/50">{c.label}{c.sub ? ` · ${c.sub}` : ""}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Recently added products</h2>
          <Link to="/admin/products" className="text-sm font-medium text-primary hover:underline">
            Manage all
          </Link>
        </div>
        {stats.recentProducts.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink/50">No products yet.</p>
        ) : (
          <div className="divide-y divide-ink/10">
            {stats.recentProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-primary-50">
                    {p.imageUrl && <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-ink/40">{p.category || "Uncategorized"}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-primary-600">${Number(p.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
