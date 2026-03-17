import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Truck, ShoppingCart, Check } from "lucide-react";
import { products, stores } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
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
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">Comparar Preços</h1>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 bg-muted rounded-xl p-3 mb-4">
          <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
          <div>
            <p className="text-xs font-bold text-foreground">{product.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{product.category}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {comparisons.map((comp, i) => (
            <div
              key={comp.store.id}
              className={`bg-card rounded-xl p-3 shadow-card border-2 ${
                i === 0 ? "border-primary" : "border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-foreground">{comp.store.name}</p>
                    {i === 0 && (
                      <span className="text-[8px] font-bold gradient-primary text-primary-foreground px-1.5 py-0.5 rounded-md">
                        Menor preço
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    <span className="text-[10px] text-foreground">{comp.store.rating}</span>
                    <Truck className="w-3 h-3 text-muted-foreground ml-1" />
                    <span className="text-[10px] text-muted-foreground">{comp.store.deliveryTime}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-base font-extrabold ${i === 0 ? "text-primary" : "text-foreground"}`}>
                    R$ {comp.price.toFixed(2).replace(".", ",")}
                  </p>
                  {!comp.inStock && (
                    <p className="text-[9px] text-destructive font-semibold">Indisponível</p>
                  )}
                </div>
              </div>
              {comp.inStock && (
                <button
                  onClick={() => handleAddToCart(comp)}
                  disabled={addedStoreId === comp.store.id}
                  className={`mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg transition-colors ${
                    addedStoreId === comp.store.id
                      ? "bg-green-500/10 text-green-600"
                      : i === 0
                        ? "gradient-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {addedStoreId === comp.store.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Adicionado
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparePrices;
