import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, MapPin, Phone } from "lucide-react";
import { sendMessage } from "../firebase/messages";

const initial = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await sendMessage(form);
      toast.success("Message sent — we'll get back to you soon!");
      setForm(initial);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section grid gap-12 py-16 md:grid-cols-2">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</span>
        <h1 className="mt-3 text-3xl font-bold">Let's talk</h1>
        <p className="mt-4 text-ink/60">
          Questions about an order, a product, or a partnership? Send a message
          and it'll land straight in our team's inbox.
        </p>

        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-primary-600"><MapPin size={16} /></span>
            Phnom Penh, Cambodia
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-primary-600"><Phone size={16} /></span>
            +855 12 345 678
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-primary-600"><Mail size={16} /></span>
            hello@novamart.dev
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label">Name</label>
          <input className="input" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label className="label">Subject</label>
          <input className="input" name="subject" value={form.subject} onChange={handleChange} required />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea className="input" rows={4} name="message" value={form.message} onChange={handleChange} required />
        </div>
        <button className="btn-primary w-full" disabled={submitting}>
          {submitting ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
