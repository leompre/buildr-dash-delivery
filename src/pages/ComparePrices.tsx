import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Truck, ShoppingCart, Check, BadgePercent, ChevronRight } from "lucide-react";
import { products, stores } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";

const ComparePrices = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const product = products.find((p) => p.id === id);

  const comparisons = useMemo(() => {
    if (!product) return [];
    return stores.slice(0, 4).map((store, i) => ({
      store,
      price: parseFloat((product.price + (i - 1) * (i * 2.5 + 1.3)).toFixed(2)),
      inStock: i !== 2,
    })).sort((a, b) => a.price - b.price);
  }, [product]);

  // Auto-select cheapest on first render
  const effectiveSelectedId = selectedStoreId ?? (comparisons.length > 0 ? comparisons[0].store.id : null);
  const selectedComp = comparisons.find((c) => c.store.id === effectiveSelectedId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  if (!product) return null;

  const lowestPrice = comparisons.length > 0 ? comparisons[0].price : 0;

  const handleSelect = (storeId: string) => {
    setSelectedStoreId(storeId);
    setIsAdded(false);
  };

  const handleAddToCart = () => {
    if (!selectedComp || !selectedComp.inStock) return;
    const cartProduct = {
      ...product,
      price: selectedComp.price,
      store: selectedComp.store.name,
    };
    addItem(cartProduct);
    setIsAdded(true);
    toast.success(`Adicionado ao carrinho via ${selectedComp.store.name}`);
    setTimeout(() => setIsAdded(false), 2500);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen pb-28 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">Comparar Preços</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Product Card - shows selected store info */}
        <button
          onClick={() => navigate(`/produto/${product.id}`)}
          className="flex items-center gap-4 bg-card rounded-2xl p-4 shadow-card text-left w-full hover:ring-2 hover:ring-primary/30 transition-all active:scale-[0.98]"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground leading-tight">{product.name}</p>
            {selectedComp && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                via {selectedComp.store.name}
              </p>
            )}
            <p className="text-base font-extrabold text-primary mt-1">
              R$ {(selectedComp?.price ?? lowestPrice).toFixed(2).replace(".", ",")}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>

        {/* Label */}
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
          Selecione a loja
        </p>

        {/* Store Comparison List — selectable cards */}
        <div className="flex flex-col gap-2.5">
          {comparisons.map((comp, i) => {
            const isSelected = comp.store.id === effectiveSelectedId;
            const isCheapest = i === 0;
            const disabled = !comp.inStock;

            return (
              <button
                key={comp.store.id}
                onClick={() => !disabled && handleSelect(comp.store.id)}
                disabled={disabled}
                className={`bg-card rounded-2xl p-4 shadow-card border-2 transition-all text-left w-full ${
                  disabled
                    ? "opacity-50 cursor-not-allowed border-transparent"
                    : isSelected
                      ? "border-primary ring-1 ring-primary/20"
                      : "border-transparent hover:border-muted-foreground/20 active:scale-[0.98]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Radio indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? "border-primary" : "border-muted-foreground/30"
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>

                  {/* Store image */}
                  <img
                    src={comp.store.image}
                    alt={comp.store.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />

                  {/* Store info */}
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

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className={`text-lg font-extrabold ${isSelected ? "text-primary" : "text-foreground"}`}>
                      R$ {comp.price.toFixed(2).replace(".", ",")}
                    </p>
                    {disabled && (
                      <p className="text-[10px] text-destructive font-semibold">Indisponível</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      {selectedComp && selectedComp.inStock && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background border-t border-border p-4 z-20">
          <Button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full h-12 rounded-xl font-bold text-sm gap-2 transition-all ${
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
                Adicionar • R$ {selectedComp.price.toFixed(2).replace(".", ",")}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ComparePrices;
