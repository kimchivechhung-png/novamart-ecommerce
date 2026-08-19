import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, Sparkles, Headphones } from "lucide-react";
import { getProducts } from "../firebase/products";
import Spinner from "../components/Spinner";

const perks = [
  { icon: Truck, title: "Same-day delivery", text: "Anywhere inside Phnom Penh, ordered before 3PM." },
  { icon: ShieldCheck, title: "12-month warranty", text: "Every item is checked and backed by our team." },
  { icon: Headphones, title: "Real support", text: "Message us and get a reply from a human, fast." },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="section grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
            <Sparkles size={12} /> New arrivals every week
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Tech that keeps up with your day, not the other way around.
          </h1>
          <p className="mt-5 max-w-md text-ink/60">
            NovaMart curates the electronics, accessories and home gadgets worth
            your money — no gimmicks, no filler catalog.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/services" className="btn-primary">
              Shop products <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-outline">
              Our story
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-100 via-primary-50 to-accent-light/40 p-10">
            <div className="flex h-full flex-col justify-between rounded-2xl bg-white/70 p-6 backdrop-blur">
              <p className="font-display text-sm font-semibold text-primary-600">This week's pick</p>
              <div>
                <p className="font-display text-2xl font-bold">Wireless ANC Headphones</p>
                <p className="mt-1 text-sm text-ink/60">Studio-grade sound, all-day battery.</p>
              </div>
              <p className="font-display text-3xl font-bold text-primary-600">$79.00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="section grid gap-6 py-10 md:grid-cols-3">
        {perks.map((p) => (
          <div key={p.title} className="card flex items-start gap-4 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
              <p.icon size={18} />
            </span>
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="mt-1 text-sm text-ink/60">{p.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured products */}
      <section className="section py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured products</h2>
            <p className="mt-1 text-sm text-ink/60">Pulled live from our catalog.</p>
          </div>
          <Link to="/services" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <Spinner label="Loading products..." />
        ) : products.length === 0 ? (
          <div className="card p-10 text-center text-ink/50">
            No products yet — add some from the admin dashboard.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <Link to={`/services/${p.id}`} key={p.id} className="card group overflow-hidden">
                <div className="aspect-square overflow-hidden bg-primary-50">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-primary-200 font-display text-4xl">
                      {p.name?.[0]}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="mt-1 text-sm font-bold text-primary-600">${Number(p.price).toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
