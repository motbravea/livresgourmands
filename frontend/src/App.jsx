import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Ouvrages from './pages/Ouvrages';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Categories from './pages/Categories';
import NotFound from './pages/NotFound';

import AdminOverview from './pages/admin/AdminOverview';
import AdminOuvrages from './pages/admin/AdminOuvrages';
import AdminCategories from './pages/admin/AdminCategories';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* ---------- Public site ---------- */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/ouvrages" element={<Ouvrages />} />
              <Route path="/ouvrages/:id" element={<ProductDetails />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* ---------- Auth (no shared layout) ---------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ---------- Admin (protected) ---------- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="ouvrages" element={<AdminOuvrages />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
