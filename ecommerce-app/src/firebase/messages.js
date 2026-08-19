// Handles the "messages" collection (Contact page submissions).
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const messagesRef = collection(db, "messages");

export async function sendMessage({ name, email, subject, message }) {
  return addDoc(messagesRef, {
    name,
    email,
    subject,
    message,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function getMessages() {
  const q = query(messagesRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteMessage(id) {
  return deleteDoc(doc(db, "messages", id));
}
