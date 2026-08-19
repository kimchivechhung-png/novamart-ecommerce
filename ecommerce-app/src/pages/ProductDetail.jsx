import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { getProduct } from "../firebase/products";
import { useCart } from "../context/CartContext";
import Spinner from "../components/Spinner";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  const stock = product?.stock === undefined || product?.stock === null ? null : Number(product.stock);
  const outOfStock = stock !== null && stock <= 0;

  function handleAddToCart() {
    addItem(product, quantity);
    toast.success(`Added ${quantity} × ${product.name} to cart`);
  }

  function handleBuyNow() {
    addItem(product, quantity);
    navigate("/cart");
  }

  if (loading) return <Spinner label="Loading product..." />;

  if (!product) {
    return (
      <div className="section py-24 text-center">
        <p className="text-ink/60">Product not found.</p>
        <Link to="/services" className="btn-primary mt-4 inline-flex">Back to catalog</Link>
      </div>
    );
  }

  return (
    <div className="section py-16">
      <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-primary">
        <ArrowLeft size={14} /> Back to catalog
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-primary-50">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-primary-200 font-display text-6xl">
              {product.name?.[0]}
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{product.category}</p>
          )}
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-3 font-display text-3xl font-bold text-primary-600">
            ${Number(product.price).toFixed(2)}
          </p>
          <p className="mt-5 text-ink/60">{product.description}</p>

          <ul className="mt-6 space-y-2 text-sm text-ink/70">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className={outOfStock ? "text-red-400" : "text-primary"} />
              {outOfStock ? (
                <span className="font-medium text-red-600">Out of stock</span>
              ) : (
                <>In stock: {stock ?? "Available"}</>
              )}
            </li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> 12-month warranty included</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Free delivery in Phnom Penh</li>
          </ul>

          {!outOfStock && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-ink/15">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="grid h-10 w-10 place-items-center text-ink/60 hover:text-primary"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => (stock == null ? q + 1 : Math.min(q + 1, stock)))}
                  disabled={stock != null && quantity >= stock}
                  className="grid h-10 w-10 place-items-center text-ink/60 hover:text-primary disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              {stock != null && (
                <span className="text-xs text-ink/40">{stock} available</span>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={handleAddToCart} disabled={outOfStock} className="btn-primary">
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>
            <button onClick={handleBuyNow} disabled={outOfStock} className="btn-outline">
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}