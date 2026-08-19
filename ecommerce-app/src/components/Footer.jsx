import { Link } from "react-router-dom";
import { ShoppingBag, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-white">
      <div className="section grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">
              <ShoppingBag size={16} />
            </span>
            NovaMart
          </div>
          <p className="mt-3 text-sm text-ink/60">
            Everyday electronics and gadgets, picked and priced for Phnom Penh shoppers.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li><Link to="/services" className="hover:text-primary">Products</Link></li>
            <li><Link to="/about" className="hover:text-primary">About us</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Account</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li><Link to="/login" className="hover:text-primary">Log in</Link></li>
            <li><Link to="/register" className="hover:text-primary">Create account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Get in touch</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li className="flex items-center gap-2"><MapPin size={14} /> Phnom Penh, Cambodia</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +855 12 345 678</li>
            <li className="flex items-center gap-2"><Mail size={14} /> hello@novamart.dev</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10 py-5 text-center text-xs text-ink/40">
        © {new Date().getFullYear()} NovaMart. Built with React &amp; Firebase.
      </div>
    </footer>
  );
}
