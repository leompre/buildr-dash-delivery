import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { products, categories } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const category = categories.find((c) => c.id === id);
  const categoryProducts = products.filter((p) => p.category === id);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">
          {category ? `${category.icon} ${category.name}` : "Categoria"}
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {categoryProducts.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Nenhum produto encontrado nesta categoria.
          </p>
        ) : (
          categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} horizontal />
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
