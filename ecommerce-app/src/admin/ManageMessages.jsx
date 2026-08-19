import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Mail } from "lucide-react";
import { getMessages, deleteMessage } from "../firebase/messages";
import Spinner from "../components/Spinner";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getMessages()
      .then(setMessages)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this message?")) return;
    setDeletingId(id);
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="mt-1 text-sm text-ink/60">Submissions from the public Contact page.</p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <Spinner />
        ) : messages.length === 0 ? (
          <div className="card p-14 text-center text-sm text-ink/50">No messages yet.</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-600">
                    <Mail size={16} />
                  </span>
                  <div>
                    <p className="font-semibold">{m.subject}</p>
                    <p className="text-xs text-ink/40">{m.name} · {m.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(m.id)}
                  disabled={deletingId === m.id}
                  className="rounded-lg p-2 text-ink/40 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="mt-3 text-sm text-ink/70">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
