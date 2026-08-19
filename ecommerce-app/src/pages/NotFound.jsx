import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="section flex flex-col items-center justify-center py-32 text-center">
      <p className="font-display text-6xl font-bold text-primary-200">404</p>
      <p className="mt-3 text-lg font-semibold">Page not found</p>
      <p className="mt-1 text-ink/60">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Back home</Link>
    </div>
  );
}
