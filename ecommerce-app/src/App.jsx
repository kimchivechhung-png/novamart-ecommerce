import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import PublicLayout from "./components/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AdminLayout from "./admin/AdminLayout";
import AdminOverview from "./admin/AdminOverview";
import ManageProducts from "./admin/ManageProducts";
import ManageOrders from "./admin/ManageOrders";
import ManageUsers from "./admin/ManageUsers";
import ManageMessages from "./admin/ManageMessages";

export default function App() {
  return (
    <BrowserRouter basename="/novamart-ecommerce">
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
          <Routes>
            {/* Public site */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              {/* Any signed-in user */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>
            {/* Auth pages (no navbar/footer) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Admin dashboard - admin role only */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="messages" element={<ManageMessages />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
