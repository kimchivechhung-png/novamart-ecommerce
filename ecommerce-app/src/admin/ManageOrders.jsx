import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Clock } from "lucide-react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../firebase/orders";
import Spinner from "../components/Spinner";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-primary-50 text-primary-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(id, status) {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success("Order status updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("Order deleted");
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>
      <p className="mt-1 text-sm text-ink/60">All customer orders, newest first.</p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <Spinner />
        ) : orders.length === 0 ? (
          <div className="card p-14 text-center text-sm text-ink/50">No orders yet.</div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">Order #{o.id.slice(0, 8)}</p>
                  <p className="text-xs text-ink/50">{o.userEmail}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/40">
                    <Clock size={12} />
                    {o.createdAt?.toDate ? o.createdAt.toDate().toLocaleString() : "Just now"}
                  </p>
                  {o.address && <p className="mt-1 text-xs text-ink/50">📍 {o.address}</p>}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={o.status}
                    disabled={updatingId === o.id}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize outline-none ${statusStyles[o.status] || "bg-ink/5"}`}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="rounded-lg p-2 text-ink/40 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete order"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-4 divide-y divide-ink/10 text-sm">
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
          ))
        )}
      </div>
    </div>
  );
}
