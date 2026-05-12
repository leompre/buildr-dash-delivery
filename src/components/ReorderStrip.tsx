import { RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useOrders } from "@/contexts/OrdersContext";
import { useCart } from "@/contexts/CartContext";

const ReorderStrip = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { addItem } = useCart();

  const recentItems = useMemo(() => {
    const seen = new Set<string>();
    const list: { id: string; name: string; image: string; price: number; product: any }[] = [];
    for (const order of orders) {
      for (const it of order.items) {
        if (seen.has(it.product.id)) continue;
        seen.add(it.product.id);
        list.push({
          id: it.product.id,
          name: it.product.name,
          image: it.product.image,
          price: it.product.price,
          product: it.product,
        });
        if (list.length >= 8) break;
      }
      if (list.length >= 8) break;
    }
    return list;
  }, [orders]);

  if (recentItems.length === 0) return null;

  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 text-primary" /> Comprar de novo
        </h3>
        <button onClick={() => navigate("/pedidos")} className="text-xs font-semibold text-primary">
          Ver pedidos
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {recentItems.map((it) => (
          <div
            key={it.id}
            className="snap-start flex flex-col bg-card rounded-xl shadow-card min-w-[120px] max-w-[120px] overflow-hidden"
          >
            <button onClick={() => navigate(`/produto/${it.id}`)} className="text-left">
              <div className="w-full h-20 bg-muted">
                <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-[11px] font-bold text-foreground line-clamp-2 leading-tight">
                  {it.name}
                </p>
                <p className="text-xs font-extrabold text-primary mt-1">
                  R$ {it.price.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </button>
            <button
              onClick={() => addItem(it.product, 1)}
              className="m-2 mt-0 h-7 rounded-lg gradient-primary text-primary-foreground text-[10px] font-bold"
            >
              Adicionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReorderStrip;
