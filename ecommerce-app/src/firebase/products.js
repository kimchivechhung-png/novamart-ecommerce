// CRUD helpers for the "products" collection in Firestore.
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "./config";

const productsRef = collection(db, "products");

export async function getProducts() {
  const q = query(productsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProduct(id) {
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createProduct(data) {
  return addDoc(productsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id, data) {
  return updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, "products", id));
}

// Atomically checks and decrements stock for a batch of cart items.
// Reads every product first, verifies each has enough stock, then writes
// all the decrements — all inside one transaction so concurrent checkouts
// can't oversell the same item. Throws if any item is out of stock.
export async function decrementStockForOrder(items) {
  return runTransaction(db, async (transaction) => {
    const refs = items.map((item) => doc(db, "products", item.id));
    const snaps = await Promise.all(refs.map((ref) => transaction.get(ref)));

    snaps.forEach((snap, i) => {
      const item = items[i];
      if (!snap.exists()) throw new Error(`"${item.name}" is no longer available.`);
      const currentStock = Number(snap.data().stock) || 0;
      if (currentStock < item.quantity) {
        throw new Error(
          `Only ${currentStock} left of "${item.name}" — please adjust the quantity in your cart.`
        );
      }
    });

    snaps.forEach((snap, i) => {
      const item = items[i];
      const currentStock = Number(snap.data().stock) || 0;
      transaction.update(refs[i], { stock: currentStock - item.quantity });
    });
  });
}