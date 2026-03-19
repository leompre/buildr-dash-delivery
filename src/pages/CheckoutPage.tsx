import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Banknote, QrCode, ChevronRight, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type PaymentMethod = "pix" | "credit" | "debit" | "cash";

const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "pix", label: "PIX", icon: <QrCode className="w-5 h-5" />, description: "Aprovação instantânea" },
  { id: "credit", label: "Cartão de Crédito", icon: <CreditCard className="w-5 h-5" />, description: "Até 12x sem juros" },
  { id: "debit", label: "Cartão de Débito", icon: <CreditCard className="w-5 h-5" />, description: "Débito na hora" },
  { id: "cash", label: "Dinheiro", icon: <Banknote className="w-5 h-5" />, description: "Pague na entrega" },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("pix");
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = items.length > 0 ? 12.0 : 0;
  const discount = selectedPayment === "pix" ? subtotal * 0.05 : 0;
  const total = subtotal + deliveryFee - discount;

  // Redirect in useEffect to avoid state updates during render
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else if (items.length === 0) {
      navigate("/carrinho");
    }
  }, [user, items.length, navigate]);

  if (!user || items.length === 0) return null;

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    clearCart();
    toast.success("Pedido confirmado com sucesso! 🎉");
    navigate("/rastreamento");
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">Finalizar Pedido</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Delivery Address */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Endereço de entrega</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Rua Exemplo, 123 - Centro
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Delivery estimate */}
        <div className="bg-card rounded-xl p-4 shadow-card flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
            <Truck className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Entrega estimada</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Hoje, 45-60 min</p>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <p className="text-xs font-bold text-foreground mb-3">
            Itens do pedido ({items.length})
          </p>
          <div className="flex flex-col gap-2.5 max-h-40 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-10 h-10 rounded-lg object-cover"
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
        </div>

        {/* Payment Method */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <p className="text-xs font-bold text-foreground mb-3">Forma de pagamento</p>
          <div className="flex flex-col gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  selectedPayment === method.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/50 hover:bg-muted"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    selectedPayment === method.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {method.icon}
                </div>
                <div className="text-left flex-1">
                  <p className="text-xs font-bold text-foreground">{method.label}</p>
                  <p className="text-[10px] text-muted-foreground">{method.description}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === method.id
                      ? "border-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {selectedPayment === method.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {selectedPayment === "pix" && (
            <div className="mt-3 bg-green-500/10 rounded-lg p-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-[10px] text-green-700 font-semibold">
                5% de desconto pagando com PIX!
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl p-4 shadow-card flex flex-col gap-2">
          <p className="text-xs font-bold text-foreground mb-1">Resumo</p>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Taxa de entrega</span>
            <span>R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[11px] text-green-600 font-semibold">
              <span>Desconto PIX (5%)</span>
              <span>- R$ {discount.toFixed(2).replace(".", ",")}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between mt-1">
            <span className="text-sm font-extrabold text-foreground">Total</span>
            <span className="text-sm font-extrabold text-primary">
              R$ {total.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirmOrder}
          disabled={isProcessing}
          className="w-full h-12 gradient-primary text-primary-foreground font-bold text-sm rounded-xl"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processando...
            </span>
          ) : (
            `Confirmar Pedido • R$ ${total.toFixed(2).replace(".", ",")}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
