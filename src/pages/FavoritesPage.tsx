import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import ProductCard from "@/components/ProductCard";

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h1 className="text-base font-extrabold text-foreground">❤️ Favoritos</h1>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-sm font-bold text-foreground">Nenhum favorito ainda</p>
            <p className="text-xs text-muted-foreground mt-1">
              Toque no ❤️ nos produtos para salvá-los aqui
            </p>
          </div>
        ) : (
          favorites.map((product) => (
            <ProductCard key={product.id} product={product} horizontal />
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
