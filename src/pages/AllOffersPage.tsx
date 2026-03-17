import { products } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllOffersPage = () => {
  const navigate = useNavigate();
  const offers = products.filter((p) => p.badge === "Oferta");

  return (
    <div className="pb-4">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-extrabold text-foreground">🔥 Todas as Ofertas</h1>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        {offers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default AllOffersPage;
