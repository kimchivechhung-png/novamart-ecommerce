import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, Shield, Trash2 } from "lucide-react";
import { getUsers, setUserRole, deleteUserProfile } from "../firebase/users";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function ManageUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      setUsers(await getUsers());
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRole(user) {
    const nextRole = user.role === "admin" ? "customer" : "admin";
    if (!confirm(`Set ${user.name || user.email}'s role to "${nextRole}"?`)) return;
    setUpdatingId(user.id);
    try {
      await setUserRole(user.id, nextRole);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)));
      toast.success(`Role updated to ${nextRole}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(user) {
    const ok = confirm(
      `Remove ${user.name || user.email}'s profile and access?\n\n` +
      `This deletes their store profile (role, name, orders link) but does NOT delete their ` +
      `login itself — for that, remove them in Firebase Console > Authentication > Users.`
    );
    if (!ok) return;
    setDeletingId(user.id);
    try {
      await deleteUserProfile(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("User profile removed");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="mt-1 text-sm text-ink/60">
        Manage access levels. Admins can manage the whole store; customers have read-only shopping access.
      </p>

      <div className="card mt-6 overflow-x-auto">
        {loading ? (
          <Spinner />
        ) : users.length === 0 ? (
          <p className="py-14 text-center text-sm text-ink/50">No users yet.</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/40">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-3 font-medium">{u.name || "—"}</td>
                  <td className="px-5 py-3 text-ink/60">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        u.role === "admin" ? "bg-primary-50 text-primary-600" : "bg-ink/5 text-ink/60"
                      }`}
                    >
                      {u.role === "admin" ? <ShieldCheck size={12} /> : <Shield size={12} />}
                      {u.role || "customer"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleRole(u)}
                        disabled={updatingId === u.id || u.id === currentUser.uid}
                        title={u.id === currentUser.uid ? "You can't change your own role" : ""}
                        className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary disabled:opacity-40"
                      >
                        {u.role === "admin" ? "Revoke admin" : "Make admin"}
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        disabled={deletingId === u.id || u.id === currentUser.uid}
                        title={u.id === currentUser.uid ? "You can't delete yourself" : "Remove user profile"}
                        className="rounded-lg p-2 text-ink/40 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}