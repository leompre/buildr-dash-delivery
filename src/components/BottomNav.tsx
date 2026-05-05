import { Home, Heart, ShoppingCart, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

const navItems = [
  { icon: Home, label: "Início", path: "/" },
  { icon: Heart, label: "Favoritos", path: "/favoritos" },
  { icon: ShoppingCart, label: "Carrinho", path: "/carrinho" },
  { icon: User, label: "Perfil", path: "/perfil" },
];

// Pages where bottom nav should be hidden
const hiddenPaths = ["/auth", "/reset-password", "/checkout", "/pedido-confirmado"];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { favorites } = useFavorites();

  // Hide on specific pages
  if (hiddenPaths.some((p) => location.pathname.startsWith(p))) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t border-border safe-bottom z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const badgeCount = item.path === "/carrinho" ? totalItems : item.path === "/favoritos" ? favorites.length : 0;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "fill-primary/20" : ""}`} />
              <span className="text-[10px] font-semibold">{item.label}</span>
              {badgeCount > 0 && (
                <span className="absolute -top-0.5 right-0.5 w-4 h-4 rounded-full gradient-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                  {badgeCount > 99 ? "99" : badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
