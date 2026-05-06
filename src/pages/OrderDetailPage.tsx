import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders, statusLabels, type OrderStatus } from "@/contexts/OrdersContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const statusStyles: Record<OrderStatus, string> = {
  preparing: "bg-yellow-500/15 text-yellow-700",
  in_transit: "bg-blue-500/15 text-blue-700",
  delivered: "bg-green-500/15 text-green-700",
  canceled: "bg-destructive/15 text-destructive",
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder } = useOrders();
  const { addItem } = useCart();
  const order = id ? getOrder(id) : undefined;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 gap-3">
        <h2 className="text-lg font-extrabold text-foreground">Pedido não encontrado</h2>
        <Button onClick={() => navigate("/pedidos")} className="rounded-xl">
          Voltar para meus pedidos
        </Button>
      </div>
    );
  }

  const reorder = () => {
    order.items.forEach((it) => addItem(it.product, it.qty));
    toast.success("Itens adicionados ao carrinho");
    navigate("/carrinho");
  };

  return (
    <div className="flex flex-col pb-28">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
        <button onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">
          Pedido #{order.number}
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">Status atual</p>
            <p className="text-sm font-extrabold text-foreground">
              {statusLabels[order.status]}
            </p>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusStyles[order.status]}`}
          >
            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card flex flex-col gap-3">
          <p className="text-xs font-bold text-foreground">Itens</p>
          {order.items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-foreground truncate">
                  {item.product.name}
                </p>
                <p className="text-[10px] text-muted-foreground">Qtd: {item.qty}</p>
              </div>
              <p className="text-xs font-bold text-foreground">
                R$ {(item.product.price * item.qty).toFixed(2).replace(".", ",")}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <p className="text-[10px] text-muted-foreground">Endereço</p>
              <p className="text-xs font-semibold text-foreground">{order.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Truck className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <p className="text-[10px] text-muted-foreground">Entrega</p>
              <p className="text-xs font-semibold text-foreground">{order.delivery}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CreditCard className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <p className="text-[10px] text-muted-foreground">Pagamento</p>
              <p className="text-xs font-semibold text-foreground">{order.payment}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 shadow-card flex flex-col gap-2">
          <p className="text-xs font-bold text-foreground mb-1">Resumo</p>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Subtotal</span>
            <span>R$ {order.subtotal.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Entrega</span>
            <span>
              {order.deliveryFee === 0
                ? "Grátis"
                : `R$ ${order.deliveryFee.toFixed(2).replace(".", ",")}`}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[11px] text-green-600 font-semibold">
              <span>Descontos</span>
              <span>- R$ {order.discount.toFixed(2).replace(".", ",")}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between mt-1">
            <span className="text-sm font-extrabold text-foreground">Total</span>
            <span className="text-sm font-extrabold text-primary">
              R$ {order.total.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background border-t border-border p-4 z-20 flex gap-2">
        <Button
          onClick={() => navigate(`/rastreamento?id=${order.id}`)}
          variant="outline"
          className="flex-1 h-12 font-bold rounded-xl"
        >
          <Package className="w-4 h-4 mr-2" />
          Rastrear
        </Button>
        <Button
          onClick={reorder}
          className="flex-1 h-12 gradient-primary text-primary-foreground font-bold rounded-xl"
        >
          Repetir pedido
        </Button>
      </div>
    </div>
  );
};

export default OrderDetailPage;
