import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Truck, ShoppingCart, Check, BadgePercent } from "lucide-react";
import { products, stores } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { toast } from "sonner";

const ComparePrices = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [addedStoreId, setAddedStoreId] = useState<string | null>(null);

  const product = products.find((p) => p.id === id);

  const comparisons = useMemo(() => {
    if (!product) return [];
    return stores.slice(0, 4).map((store, i) => ({
      store,
      price: parseFloat((product.price + (i - 1) * (i * 2.5 + 1.3)).toFixed(2)),
      inStock: i !== 2,
    })).sort((a, b) => a.price - b.price);
  }, [product]);

  if (!product) return null;

  const lowestPrice = comparisons.length > 0 ? comparisons[0].price : 0;

  const handleAddToCart = (comp: typeof comparisons[0]) => {
    const cartProduct = {
      ...product,
      price: comp.price,
      store: comp.store.name,
    };
    addItem(cartProduct);
    setAddedStoreId(comp.store.id);
    toast.success(`Adicionado ao carrinho via ${comp.store.name}`);
    setTimeout(() => setAddedStoreId(null), 2000);
  };

  return (
    <div className="flex flex-col pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">Comparar Preços</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Product Card */}
        <div className="flex items-center gap-4 bg-card rounded-2xl p-4 shadow-card">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground leading-tight">{product.name}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{product.category}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <BadgePercent className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-semibold text-primary">
                Melhor: R$ {lowestPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        </div>

        {/* Store Comparison List */}
        <div className="flex flex-col gap-3">
          {comparisons.map((comp, i) => {
            const isAdded = addedStoreId === comp.store.id;
            const isCheapest = i === 0;

            return (
              <div
                key={comp.store.id}
                className={`bg-card rounded-2xl p-4 shadow-card border-2 transition-all ${
                  isCheapest ? "border-primary" : "border-transparent"
                }`}
              >
                {/* Store info row */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">
                    🏪
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground truncate">{comp.store.name}</p>
                      {isCheapest && (
                        <span className="text-[9px] font-bold gradient-primary text-primary-foreground px-2 py-0.5 rounded-full whitespace-nowrap">
                          Menor preço
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        <span className="text-[11px] text-foreground font-medium">{comp.store.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">{comp.store.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-lg font-extrabold ${isCheapest ? "text-primary" : "text-foreground"}`}>
                      R$ {comp.price.toFixed(2).replace(".", ",")}
                    </p>
                    {!comp.inStock && (
                      <p className="text-[10px] text-destructive font-semibold">Indisponível</p>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {comp.inStock ? (
                  <Button
                    onClick={() => handleAddToCart(comp)}
                    disabled={isAdded}
                    variant={isAdded ? "outline" : "default"}
                    className={`mt-3 w-full h-10 rounded-xl font-bold text-xs gap-2 transition-all ${
                      isAdded
                        ? "border-primary/30 text-primary bg-primary/5"
                        : "gradient-primary text-primary-foreground"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        Adicionado ao carrinho
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Adicionar ao Carrinho
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    disabled
                    variant="outline"
                    className="mt-3 w-full h-10 rounded-xl font-bold text-xs opacity-50"
                  >
                    Produto indisponível
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparePrices;
