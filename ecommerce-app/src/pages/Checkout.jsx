import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../firebase/orders";
import { decrementStockForOrder } from "../firebase/products";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="section py-24 text-center">
        <p className="text-ink/60">Your cart is empty.</p>
        <Link to="/services" className="btn-primary mt-4 inline-flex">Browse products</Link>
      </div>
    );
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setPlacing(true);
    try {
      // Reserve stock first — this throws (and blocks the order) if any
      // item no longer has enough stock, so two people can't oversell it.
      await decrementStockForOrder(items);

      const orderId = await createOrder({
        userId: currentUser.uid,
        userEmail: currentUser.email,
        items: items.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
        total: subtotal,
        address,
        notes,
      });
      clearCart();
      toast.success("Order placed!");
      navigate("/dashboard", { state: { justOrdered: orderId?.id } });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="section py-16">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-2 text-ink/60">Confirm your delivery details to place the order.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handlePlaceOrder} className="card space-y-4 p-6 lg:col-span-2">
          <div>
            <label className="label flex items-center gap-1.5"><MapPin size={14} /> Delivery address</label>
            <textarea
              className="input"
              rows={3}
              required
              placeholder="House number, street, sangkat, khan..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Order notes (optional)</label>
            <textarea
              className="input"
              rows={2}
              placeholder="Delivery instructions, preferred time, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="rounded-xl bg-primary-50 p-4 text-sm text-primary-700">
            Payment is collected on delivery (cash on delivery) for this demo store.
          </div>
          <button className="btn-primary w-full" disabled={placing}>
            {placing ? "Placing order..." : `Place order — $${subtotal.toFixed(2)}`}
          </button>
        </form>

        <div className="card h-fit p-6">
          <h2 className="font-semibold">Items</h2>
          <div className="mt-4 space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-ink/70">{item.quantity} × {item.name}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-semibold">
            <span>Total</span>
            <span className="text-primary-600">${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}