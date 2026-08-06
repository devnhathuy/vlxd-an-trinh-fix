import { Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/admin/ProtectedRoute";
import ScrollToHash from "./components/ScrollToHash";

import ProjectsPage from "./pages/ProjectsPage";
import HomePage from "./pages/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFoundPage from "./pages/NotFoundPage";
import PriceListPage from "./pages/PriceListPage";
import ContactPage from "./pages/ContactPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";

import AdminNewsPage from "./pages/admin/AdminNewsPage";
import AdminProjectsPage from "./pages/admin/AdminProjectsPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminQuotesPage from "./pages/admin/AdminQuotesPage";

export default function App() {
  return (
    <>
      <ScrollToHash />

      <Routes>
        {/* ================= PUBLIC ================= */}

        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />

          <Route path="/san-pham" element={<ProductsPage />} />

          <Route path="/san-pham/:slug" element={<ProductDetailPage />} />

          <Route path="/bang-gia" element={<PriceListPage />} />
          <Route path="/du-an" element={<ProjectsPage />} />
          <Route path="/du-an/:slug" element={<ProjectDetailPage />} />
          <Route path="/tin-tuc" element={<NewsPage />} />

          <Route path="/tin-tuc/:slug" element={<NewsDetailPage />} />
          <Route
            path="/gioi-thieu"
            element={<PlaceholderPage title="Giới thiệu" />}
          />

          <Route path="/lien-he" element={<ContactPage />} />
        </Route>

        {/* ================= ADMIN ================= */}

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <AdminNewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/quotes"
          element={
            <ProtectedRoute>
              <AdminQuotesPage />
            </ProtectedRoute>
          }
        />

        {/* ================= 404 ================= */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
