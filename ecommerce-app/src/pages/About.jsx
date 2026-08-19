import { Users, Target, Award } from "lucide-react";

const stats = [
  { label: "Orders delivered", value: "12,400+" },
  { label: "Products curated", value: "300+" },
  { label: "Avg. rating", value: "4.8/5" },
];

const values = [
  { icon: Target, title: "Curated, not crowded", text: "We list what we'd actually buy — every product is tested before it's listed." },
  { icon: Users, title: "People-first support", text: "A real person answers your messages, usually within the hour." },
  { icon: Award, title: "Honest pricing", text: "No fake discounts. The price you see is the price we think is fair." },
];

export default function About() {
  return (
    <div className="section py-16">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">About NovaMart</span>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          Built in Phnom Penh, for people who just want good tech without the hassle.
        </h1>
        <p className="mt-5 text-ink/60">
          NovaMart started as a class project and grew into a small catalog of electronics
          and accessories we personally vouch for. We handle sourcing, quality checks and
          delivery so you don't have to compare ten tabs to find one good product.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card p-6 text-center">
            <p className="font-display text-3xl font-bold text-primary-600">{s.value}</p>
            <p className="mt-1 text-sm text-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="card p-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600">
              <v.icon size={18} />
            </span>
            <p className="mt-4 font-semibold">{v.title}</p>
            <p className="mt-1.5 text-sm text-ink/60">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
