import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, ChevronRight, ShoppingBag } from "lucide-react";
import { useOrders, statusLabels, type OrderStatus } from "@/contexts/OrdersContext";

const statusStyles: Record<OrderStatus, string> = {
  preparing: "bg-yellow-500/15 text-yellow-700",
  in_transit: "bg-blue-500/15 text-blue-700",
  delivered: "bg-green-500/15 text-green-700",
  canceled: "bg-destructive/15 text-destructive",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();

  return (
    <div className="flex flex-col pb-24">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
        <button onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">Meus Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-extrabold text-foreground">Nenhum pedido ainda</h2>
          <p className="text-sm text-muted-foreground text-center">
            Quando você fizer um pedido, ele aparecerá aqui.
          </p>
          <button
            onClick={() => navigate("/")}
            className="gradient-primary text-primary-foreground font-bold px-8 py-3 rounded-xl"
          >
            Começar a comprar
          </button>
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-3">
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => navigate(`/pedido/${order.id}`)}
              className="bg-card rounded-xl p-4 shadow-card text-left flex flex-col gap-3 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-foreground">
                      Pedido #{order.number}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusStyles[order.status]}`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {order.items.slice(0, 4).map((item) => (
                  <img
                    key={item.product.id}
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-lg object-cover border border-border"
                  />
                ))}
                {order.items.length > 4 && (
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    +{order.items.length - 4}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <p className="text-[11px] text-muted-foreground">
                  {order.items.reduce((s, i) => s + i.qty, 0)} item(ns)
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-extrabold text-primary">
                    R$ {order.total.toFixed(2).replace(".", ",")}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
