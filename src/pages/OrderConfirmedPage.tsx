import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderState {
  orderNumber?: string;
  total?: number;
  delivery?: string;
  payment?: string;
}

const OrderConfirmedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as OrderState;

  useEffect(() => {
    if (!state.orderNumber) {
      navigate("/", { replace: true });
    }
  }, [state.orderNumber, navigate]);

  if (!state.orderNumber) return null;

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 pb-24 text-center">
      <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-6 animate-in zoom-in duration-500">
        <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
      </div>

      <h1 className="text-2xl font-extrabold text-foreground mb-2">
        Pedido confirmado!
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Recebemos seu pedido e ele já está sendo preparado. 🎉
      </p>

      <div className="w-full bg-card rounded-2xl p-5 shadow-card flex flex-col gap-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Número do pedido</span>
          <span className="text-sm font-extrabold text-foreground">
            #{state.orderNumber}
          </span>
        </div>
        {state.delivery && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Entrega</span>
            <span className="text-xs font-bold text-foreground">{state.delivery}</span>
          </div>
        )}
        {state.payment && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Pagamento</span>
            <span className="text-xs font-bold text-foreground">{state.payment}</span>
          </div>
        )}
        {typeof state.total === "number" && (
          <div className="border-t border-border pt-3 flex justify-between items-center">
            <span className="text-sm font-bold text-foreground">Total pago</span>
            <span className="text-base font-extrabold text-primary">
              R$ {state.total.toFixed(2).replace(".", ",")}
            </span>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-2">
        <Button
          onClick={() => navigate("/rastreamento")}
          className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl"
        >
          <Package className="w-4 h-4 mr-2" />
          Acompanhar pedido
        </Button>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="w-full h-12 font-bold rounded-xl"
        >
          <Home className="w-4 h-4 mr-2" />
          Voltar ao início
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmedPage;
