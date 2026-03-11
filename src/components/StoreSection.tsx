import { Star, Clock, Truck } from "lucide-react";
import { stores } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const StoreSection = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-extrabold text-foreground">🏪 Lojas Próximas</h3>
        <button className="text-xs font-semibold text-primary">Ver todas</button>
      </div>
      <div className="flex flex-col gap-3">
        {stores.slice(0, 4).map((store) => (
          <button
            key={store.id}
            onClick={() => navigate(`/loja/${store.id}`)}
            className="flex gap-3 bg-card rounded-xl p-3 shadow-card text-left hover:shadow-elevated transition-shadow"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground">{store.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-accent text-accent" />
                <span className="text-[10px] font-semibold text-foreground">{store.rating}</span>
                <span className="text-[10px] text-muted-foreground">
                  ({store.reviews} avaliações)
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px]">{store.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Truck className="w-3 h-3" />
                  <span className="text-[10px]">
                    R$ {store.deliveryFee.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoreSection;
