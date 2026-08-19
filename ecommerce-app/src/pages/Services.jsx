import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { getProducts } from "../firebase/products";
import Spinner from "../components/Spinner";

export default function Services() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...set];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="section py-16">
      <div className="max-w-xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Catalog</span>
        <h1 className="mt-3 text-3xl font-bold">Products &amp; services</h1>
        <p className="mt-3 text-ink/60">Browse everything currently in stock.</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            className="input pl-10"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                category === c
                  ? "border-primary bg-primary text-white"
                  : "border-ink/15 bg-white text-ink/70 hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {loading ? (
          <Spinner label="Loading catalog..." />
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center text-ink/50">No products match your search.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
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
                  {p.category && (
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-primary-500">
                      {p.category}
                    </p>
                  )}
                  <p className="truncate font-semibold">{p.name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm font-bold text-primary-600">${Number(p.price).toFixed(2)}</p>
                    {Number(p.stock) <= 0 ? (
                      <span className="text-[11px] font-semibold text-red-500">Out of stock</span>
                    ) : Number(p.stock) <= 5 ? (
                      <span className="text-[11px] font-semibold text-accent">Only {p.stock} left</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}