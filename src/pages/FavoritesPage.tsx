import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const favoriteProducts = products.slice(0, 3);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">❤️ Favoritos</h1>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-sm font-bold text-foreground">Nenhum favorito ainda</p>
            <p className="text-xs text-muted-foreground mt-1">
              Adicione produtos aos favoritos para vê-los aqui
            </p>
          </div>
        ) : (
          favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} horizontal />
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
