import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="section flex flex-col items-center justify-center py-24 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <ShoppingBag size={26} />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-ink/60">Browse the catalog and add something you like.</p>
        <Link to="/services" className="btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="section py-16">
      <h1 className="text-3xl font-bold">Your cart</h1>
      <p className="mt-2 text-ink/60">{items.length} item{items.length > 1 ? "s" : ""} in your cart</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="card flex items-center gap-4 p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-primary-50">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-primary-200 font-display text-xl">
                    {item.name?.[0]}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="text-sm text-primary-600">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center rounded-full border border-ink/15">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="grid h-9 w-9 place-items-center text-ink/60 hover:text-primary"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="grid h-9 w-9 place-items-center text-ink/60 hover:text-primary"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>

              <p className="w-20 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</p>

              <button
                onClick={() => removeItem(item.id)}
                className="rounded-lg p-2 text-ink/40 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6">
          <h2 className="font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Delivery</span>
              <span>Free</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-semibold">
            <span>Total</span>
            <span className="text-primary-600">${subtotal.toFixed(2)}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn-primary mt-6 w-full">
            Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
