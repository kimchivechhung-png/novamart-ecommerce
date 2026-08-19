# NovaMart — React + Firebase E-commerce App

A full-stack demo built for a final exam, covering both the "website" and
"system" requirements in one app:

- **Public website**: Home, About, Contact, Services/Products (with search & filter), Product detail
- **Authentication**: Register, Login, Forgot/Reset password (Firebase Auth)
- **Role-based dashboard**: Customer dashboard vs. Admin dashboard (Firestore `role` field: `customer` | `admin`)
- **CRUD**: Full Create/Read/Update/Delete for Products, plus admin views for Orders, Users and Contact Messages
- **Cart & checkout**: Add to cart, adjust quantities, checkout, and order history — orders are written to Firestore and managed from the admin dashboard

## Tech stack
- React 19 + Vite
- React Router v6
- Tailwind CSS
- Firebase (Authentication + Firestore)
- lucide-react (icons), react-hot-toast (notifications)

## 1. Create your Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. Once created, click the **Web (`</>`)** icon to register a web app, and copy the `firebaseConfig` values.
3. In **Build → Authentication → Sign-in method**, enable **Email/Password**.
4. In **Build → Firestore Database**, click **Create database** (start in test mode, then apply the rules below).

## 2. Configure environment variables
Copy `.env.example` to `.env` (already done if you received this project pre-built) and fill in your Firebase values:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 3. Install & run
```bash
npm install
npm run dev
```
Visit the printed local URL (usually `http://localhost:5173`).

## 4. Apply Firestore security rules
Open `firestore.rules` in this project, copy its contents into **Firestore Database → Rules** in the Firebase Console, and click **Publish**. These rules:
- Let anyone read products (storefront) but only admins write them.
- Let anyone submit a contact message, but only admins read/manage them.
- Let users read/update their own profile, but only admins can change roles.

## 5. Create your first admin account
Every new sign-up gets `role: "customer"` by default. To make yourself an admin:
1. Register a normal account from the app (`/register`).
2. In Firebase Console → **Firestore Database**, open the `users` collection, find your document (by uid), and change the `role` field from `customer` to `admin`.
3. Refresh the app — the Admin link now appears in the navbar, and `/admin` becomes accessible.

## Project structure
```
src/
  admin/            Admin dashboard layout + pages (Overview, Products, Orders, Users, Messages)
  components/       Shared UI (Navbar, Footer, Modal, route guards, etc.)
  context/          AuthContext (register/login/logout/reset + role lookup), CartContext (in-browser cart)
  firebase/         Firebase init + Firestore CRUD helpers (products, orders, users, messages)
  pages/            Public pages (Home, About, Contact, Services, ProductDetail, Cart, Checkout, Dashboard)
  pages/auth/       Login, Register, ForgotPassword
firestore.rules     Role-based Firestore security rules
```

## Data model
- **users/{uid}**: `{ name, email, role: "customer" | "admin", createdAt }`
- **products/{id}**: `{ name, category, price, stock, imageUrl, description, createdAt }`
- **orders/{id}**: `{ userId, userEmail, items: [{id, name, price, quantity}], total, address, notes, status, createdAt }`
- **messages/{id}**: `{ name, email, subject, message, read, createdAt }`

## Notes for your exam demo
- Register two accounts: promote one to `admin` in Firestore, keep the other as `customer`, to demonstrate role-based access.
- The Admin dashboard (`/admin`) demonstrates full CRUD on Products, order status management, and read/manage views for Users and Messages.
- As a customer: add products to your cart from the product detail page, go to `/cart`, then `/checkout` to place an order — it'll appear instantly in both your Dashboard order history and the admin Orders page.
- The Contact page write and Admin Messages read together demonstrate a full create → read → delete cycle.
- `ProtectedRoute` guards any signed-in-only page; `AdminRoute` additionally checks `role === "admin"` — good talking points for the "different access by users" requirement.
- The cart itself lives in the browser (localStorage) per user, not Firestore — only the final order is written to the database. This keeps cart edits instant with no extra reads/writes.
