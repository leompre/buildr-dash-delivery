import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Star, Clock, Truck, ShoppingCart, Plus, Minus } from "lucide-react";
import { products } from "@/data/mockData";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const product = products.find((p) => p.id === id);
  if (!product) return <div className="p-4 text-center text-muted-foreground">Produto não encontrado</div>;

  const liked = isFavorite(product.id);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id);

  const handleToggleFavorite = () => {
    toggleFavorite(product);
    if (!liked) {
      toast.success("Adicionado aos favoritos ❤️");
    } else {
      toast("Removido dos favoritos");
    }
  };

  return (
    <div className="flex flex-col pb-32">
      {/* Header */}
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center shadow-card"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center shadow-card"
        >
          <Heart className={`w-5 h-5 transition-colors ${liked ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
        {product.badge && (
          <span className="absolute bottom-4 left-4 gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-foreground">{product.name}</h1>
          <p className="text-xs text-muted-foreground mt-1">{product.store}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-bold text-foreground">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{product.delivery}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Truck className="w-3.5 h-3.5" />
            <span className="text-xs">Entrega rápida</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2">
          <span className="text-2xl font-extrabold text-primary">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through mb-0.5">
              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
          {product.originalPrice && (
            <span className="ml-1 mb-0.5 text-[10px] font-bold gradient-primary text-primary-foreground px-2 py-0.5 rounded-full">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Compare button */}
        <button
          onClick={() => navigate(`/comparar/${product.id}`)}
          className="text-xs font-semibold text-primary bg-primary/10 px-3 py-2 rounded-lg w-fit"
        >
          📊 Comparar preços em outras lojas
        </button>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-extrabold text-foreground mb-3">Produtos Relacionados</h3>
            <div className="flex flex-col gap-2">
              {relatedProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/produto/${p.id}`)}
                  className="flex items-center gap-3 bg-muted rounded-xl p-3 text-left"
                >
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">{p.name}</p>
                    <p className="text-xs font-extrabold text-primary mt-0.5">
                      R$ {p.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto bg-background/95 backdrop-blur border-t border-border p-3 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-2.5 py-2">
            <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuir">
              <Minus className="w-4 h-4 text-foreground" />
            </button>
            <span className="text-sm font-bold text-foreground w-5 text-center">{qty}</span>
            <button onClick={() => setQty(qty + 1)} aria-label="Aumentar">
              <Plus className="w-4 h-4 text-foreground" />
            </button>
          </div>
          <Button
            onClick={() => {
              addItem(product, qty);
              setQty(1);
            }}
            className="flex-1 h-11 gradient-primary text-primary-foreground font-bold rounded-xl gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Adicionar • R$ {(product.price * qty).toFixed(2).replace(".", ",")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
