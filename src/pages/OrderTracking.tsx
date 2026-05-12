import { ArrowLeft, Package, CheckCircle, Truck, MapPin, ShoppingBag } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useOrders, statusLabels, type OrderStatus } from "@/contexts/OrdersContext";
import { Button } from "@/components/ui/button";

const flowSteps: { status: OrderStatus; label: string; icon: typeof Package }[] = [
  { status: "preparing", label: "Pedido confirmado", icon: CheckCircle },
  { status: "preparing", label: "Loja preparando", icon: Package },
  { status: "in_transit", label: "Entregador a caminho", icon: Truck },
  { status: "delivered", label: "Entrega concluída", icon: MapPin },
];

const formatTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "--:--";

const OrderTracking = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { orders, activeOrderId, getOrder } = useOrders();

  const requestedId = params.get("id") ?? activeOrderId ?? undefined;
  const order = useMemo(() => {
    if (requestedId) return getOrder(requestedId);
    // Fallback: most recent in-progress order
    return orders.find((o) => o.status !== "delivered" && o.status !== "canceled") ?? orders[0];
  }, [requestedId, getOrder, orders]);

  if (!order) {
    return (
      <div className="flex flex-col pb-20">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => navigate(-1)} aria-label="Voltar">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-extrabold text-foreground">Rastreamento</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-6 gap-3">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-extrabold text-foreground">Nenhum pedido ativo</h2>
          <p className="text-sm text-muted-foreground text-center">
            Faça um pedido para acompanhar a entrega em tempo real.
          </p>
          <Button onClick={() => navigate("/")} className="rounded-xl">
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  // Determine progress index based on current status
  const statusRank: Record<OrderStatus, number> = {
    preparing: 1,
    in_transit: 2,
    delivered: 3,
    canceled: 0,
  };
  const currentRank = statusRank[order.status];

  // Map flowSteps -> done state + time from history
  const historyTime = (s: OrderStatus) =>
    order.history.find((h) => h.status === s)?.at;

  const stepsRendered = flowSteps.map((step, i) => {
    let done = false;
    let time: string | undefined;
    if (i === 0) {
      done = true;
      time = order.createdAt;
    } else if (step.status === "preparing") {
      done = currentRank >= 1;
      time = historyTime("preparing");
    } else if (step.status === "in_transit") {
      done = currentRank >= 2;
      time = historyTime("in_transit");
    } else if (step.status === "delivered") {
      done = currentRank >= 3;
      time = historyTime("delivered");
    }
    return { ...step, done, time };
  });

  const itemsCount = order.items.reduce((s, i) => s + i.qty, 0);
  const eta =
    order.status === "delivered"
      ? "Entregue"
      : order.status === "in_transit"
      ? "Chegando em alguns minutos"
      : "Loja preparando seu pedido";

  const isLive = order.status !== "delivered" && order.status !== "canceled";

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
        <button onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">Rastreamento</h1>
      </div>

      {/* ETA hero banner */}
      <div className="mx-4 mt-4 rounded-2xl gradient-primary p-4 shadow-elevated text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold opacity-80 uppercase tracking-wide">
              {order.status === "delivered" ? "Pedido finalizado" : "Previsão de entrega"}
            </p>
            <p className="text-xl font-extrabold mt-0.5">{eta}</p>
            <p className="text-[11px] opacity-90 mt-1">{statusLabels[order.status]}</p>
          </div>
          {isLive && (
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-primary-foreground opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mx-4 mt-3 h-36 rounded-2xl bg-muted flex items-center justify-center shadow-card overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="text-center relative">
          <MapPin className="w-7 h-7 text-primary mx-auto mb-1" />
          <p className="text-[11px] font-semibold text-foreground">Mapa em tempo real</p>
          <p className="text-[10px] text-muted-foreground">Acompanhe pelo app</p>
        </div>
      </div>

      {/* Steps */}
      <div className="p-4">
        <h3 className="text-sm font-extrabold text-foreground mb-4">Status do Pedido</h3>
        <div className="flex flex-col gap-0">
          {stepsRendered.map((step, i) => {
            const nextDone = stepsRendered[i + 1]?.done;
            const isCurrent = step.done && !nextDone && isLive;
            return (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      step.done ? "gradient-primary shadow-card" : "bg-muted"
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full gradient-primary animate-ping opacity-50" />
                    )}
                    <step.icon
                      className={`w-4 h-4 relative ${
                        step.done ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  {i < stepsRendered.length - 1 && (
                    <div
                      className={`w-0.5 h-8 transition-colors ${
                        nextDone ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-6 pt-1">
                  <p
                    className={`text-xs font-bold ${
                      step.done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 text-[10px] font-bold text-primary uppercase tracking-wide">
                        Agora
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{formatTime(step.time)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order info */}
      <button
        className="mx-4 bg-card rounded-xl p-4 shadow-card text-left active:scale-[0.99] transition-transform"
        onClick={() => navigate(`/pedido/${order.id}`)}
      >
        <p className="text-xs font-bold text-foreground">Pedido #{order.number}</p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {itemsCount} {itemsCount === 1 ? "item" : "itens"} • {order.delivery}
        </p>
        <p className="text-sm font-extrabold text-primary mt-2">
          R$ {order.total.toFixed(2).replace(".", ",")}
        </p>
      </button>
    </div>
  );
};

export default OrderTracking;
