import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layouts/AdminLayout";
import UserLayout from "./Layouts/UserLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import HomeUser from "./pages/user/Home";
import Orders from "./pages/admin/Orders";
import Cart from "./pages/user/Cart"; // 1. IMPORT FILE CART ANDA
import Customes from "./pages/admin/Customers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. PUBLIK */}
        <Route path="/login" element={<Login />} />

        {/* 2. USER AREA */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomeUser />} />
          {/* 2. TAMBAHKAN ROUTE CART DI SINI */}
          <Route path="/cart" element={<Cart />} />
        </Route>

        {/* 3. ADMIN AREA (Dengan Proteksi) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customes />} />
          </Route>
        </Route>

        {/* 4. CATCH ALL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;