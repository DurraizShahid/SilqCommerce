import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage"; // Import the new CartPage
import { CartProvider } from "./context/CartContext"; // Import CartProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider> {/* Wrap MainLayout routes with CartProvider */}
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <Index />
                </MainLayout>
              }
            />
            <Route
              path="/products"
              element={
                <MainLayout>
                  <ProductsPage />
                </MainLayout>
              }
            />
            <Route
              path="/products/:id"
              element={
                <MainLayout>
                  <ProductDetailPage />
                </MainLayout>
              }
            />
            <Route
              path="/categories"
              element={
                <MainLayout>
                  <CategoriesPage />
                </MainLayout>
              }
            />
            <Route
              path="/about"
              element={
                <MainLayout>
                  <AboutPage />
                </MainLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <MainLayout>
                  <ContactPage />
                </MainLayout>
              }
            />
            <Route
              path="/cart" // New route for CartPage
              element={
                <MainLayout>
                  <CartPage />
                </MainLayout>
              }
            />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;