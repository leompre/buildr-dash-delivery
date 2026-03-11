import { products } from "@/data/mockData";
import ProductCard from "./ProductCard";

const OfferSection = () => {
  const offers = products.filter((p) => p.badge === "Oferta");

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-extrabold text-foreground">🔥 Ofertas do Dia</h3>
        <button className="text-xs font-semibold text-primary">Ver todas</button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {offers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default OfferSection;
