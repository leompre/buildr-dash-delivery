import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import ComparePrices from "./pages/ComparePrices";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import StorePage from "./pages/StorePage";
import OrderTracking from "./pages/OrderTracking";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/favoritos" element={<FavoritesPage />} />
                <Route path="/carrinho" element={<CartPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/categoria/:id" element={<CategoryPage />} />
                <Route path="/loja/:id" element={<StorePage />} />
              </Route>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/produto/:id" element={<ProductDetail />} />
              <Route path="/comparar/:id" element={<ComparePrices />} />
              <Route path="/rastreamento" element={<OrderTracking />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
