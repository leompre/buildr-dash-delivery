import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import AppLayout from "./components/AppLayout";
import BottomNav from "./components/BottomNav";
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
import AllOffersPage from "./pages/AllOffersPage";
import AllStoresPage from "./pages/AllStoresPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
        <OrdersProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" duration={2000} closeButton />
          <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/favoritos" element={<FavoritesPage />} />
                  <Route path="/carrinho" element={<CartPage />} />
                  <Route path="/perfil" element={<ProfilePage />} />
                  <Route path="/pedidos" element={<OrdersPage />} />
                  <Route path="/pedido/:id" element={<OrderDetailPage />} />
                  <Route path="/categoria/:id" element={<CategoryPage />} />
                  <Route path="/loja/:id" element={<StorePage />} />
                </Route>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/produto/:id" element={<ProductDetail />} />
                <Route path="/comparar/:id" element={<ComparePrices />} />
                <Route path="/ofertas" element={<AllOffersPage />} />
                <Route path="/lojas" element={<AllStoresPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/pedido-confirmado" element={<OrderConfirmedPage />} />
                <Route path="/rastreamento" element={<OrderTracking />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNav />
            </div>
          </BrowserRouter>
        </TooltipProvider>
        </OrdersProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
