import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Truck } from "lucide-react";
import { products, stores } from "@/data/mockData";

const ComparePrices = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);
  if (!product) return null;

  // Mock comparison data
  const comparisons = stores.slice(0, 4).map((store, i) => ({
    store,
    price: product.price + (i - 1) * (Math.random() * 5 + 1),
    inStock: i !== 2,
  })).sort((a, b) => a.price - b.price);

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
              className={`flex items-center gap-3 bg-card rounded-xl p-3 shadow-card border-2 ${
                i === 0 ? "border-primary" : "border-transparent"
              }`}
            >
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparePrices;
