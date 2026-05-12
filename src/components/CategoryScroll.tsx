import { categories } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const CategoryScroll = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4">
      <h3 className="text-sm font-extrabold text-foreground mb-3">Categorias</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/categoria/${cat.id}`)}
            className="snap-start flex flex-col items-center gap-1.5 min-w-[64px] active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-muted to-secondary/40 flex items-center justify-center text-2xl shadow-card hover:shadow-elevated transition-shadow">
              {cat.icon}
            </div>
            <span className="text-[10px] font-semibold text-foreground text-center leading-tight">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
