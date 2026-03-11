import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Clock, Truck, MessageCircle } from "lucide-react";
import { stores, products } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";

const StorePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const store = stores.find((s) => s.id === id);
  if (!store) return <div className="p-4 text-center text-muted-foreground">Loja não encontrada</div>;

  const storeProducts = products.filter((p) => p.storeId === id);

  return (
    <div className="flex flex-col">
      <div className="relative">
        <img src={store.image} alt={store.name} className="w-full h-36 object-cover" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center shadow-card"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-foreground">{store.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="text-sm font-bold text-foreground">{store.rating}</span>
              <span className="text-xs text-muted-foreground">({store.reviews} avaliações)</span>
            </div>
          </div>
          <button className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-2 rounded-lg">
            <MessageCircle className="w-3.5 h-3.5" />
            Chat
          </button>
        </div>

        <div className="flex items-center gap-4 mt-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{store.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span className="text-xs">Entrega: R$ {store.deliveryFee.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>

        <h3 className="text-sm font-extrabold text-foreground mt-5 mb-3">Produtos</h3>
        <div className="flex flex-col gap-3">
          {storeProducts.map((product) => (
            <ProductCard key={product.id} product={product} horizontal />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
