// Handles the "orders" collection: customers create orders at checkout,
// customers read their own orders, admins read/manage all orders.
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const ordersRef = collection(db, "orders");

export async function createOrder({ userId, userEmail, items, total, address, notes }) {
  return addDoc(ordersRef, {
    userId,
    userEmail,
    items, // [{ id, name, price, quantity }]
    total,
    address: address || "",
    notes: notes || "",
    status: "pending", // pending -> processing -> shipped -> delivered (or cancelled)
    createdAt: serverTimestamp(),
  });
}

export async function getOrdersByUser(userId) {
  const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllOrders() {
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateOrderStatus(id, status) {
  return updateDoc(doc(db, "orders", id), { status });
}

export async function deleteOrder(id) {
  return deleteDoc(doc(db, "orders", id));
}
