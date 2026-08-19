// Admin-facing helpers for the "users" collection.
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "./config";

const usersRef = collection(db, "users");

export async function getUsers() {
  const q = query(usersRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function setUserRole(uid, role) {
  return updateDoc(doc(db, "users", uid), { role });
}

// Removes the user's profile document (name, role, etc). This revokes their
// access to the dashboard/admin area, but their Firebase Authentication
// login itself is NOT deleted — client apps can't delete other users'
// login accounts for security reasons. To fully remove the login too,
// delete them from Firebase Console -> Authentication -> Users.
export async function deleteUserProfile(uid) {
  return deleteDoc(doc(db, "users", uid));
}