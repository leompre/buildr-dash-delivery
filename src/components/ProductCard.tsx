import { Star, Clock, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/data/mockData";
import { useFavorites } from "@/contexts/FavoritesContext";

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

const ProductCard = ({ product, horizontal = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(product.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  if (horizontal) {
    return (
      <div className="flex gap-3 bg-card rounded-xl p-3 shadow-card w-full text-left relative">
        <button
          onClick={() => navigate(`/produto/${product.id}`)}
          className="flex gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
        >
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <span className="absolute top-1 left-1 gradient-primary text-primary-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                {product.badge}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{product.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{product.store}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span className="text-[10px] font-semibold text-foreground">{product.rating}</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-extrabold text-primary">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>
          </div>
        </button>
        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-muted/80 flex items-center justify-center"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-card rounded-xl shadow-card min-w-[150px] max-w-[150px] overflow-hidden text-left relative">
      <button
        onClick={() => navigate(`/produto/${product.id}`)}
        className="hover:shadow-elevated transition-shadow"
      >
        <div className="relative w-full h-28 bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {product.badge && (
            <span className="absolute top-2 left-2 gradient-primary text-primary-foreground text-[8px] font-bold px-2 py-0.5 rounded-md">
              {product.badge}
            </span>
          )}
        </div>
        <div className="p-2.5 flex flex-col gap-1">
          <p className="text-[11px] font-bold text-foreground leading-tight line-clamp-2">
            {product.name}
          </p>
          <p className="text-[9px] text-muted-foreground">{product.store}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span className="text-[9px] font-semibold text-foreground">{product.rating}</span>
            <span className="text-[9px] text-muted-foreground">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-sm font-extrabold text-primary">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          </div>
          {product.originalPrice && (
            <span className="text-[9px] text-muted-foreground line-through">
              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="text-[9px]">{product.delivery}</span>
          </div>
        </div>
      </button>
      <button
        onClick={handleFavorite}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-card/80 backdrop-blur flex items-center justify-center"
      >
        <Heart className={`w-3 h-3 transition-colors ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      </button>
    </div>
  );
};

export default ProductCard;
