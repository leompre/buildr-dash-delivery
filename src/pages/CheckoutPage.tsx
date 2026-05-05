import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Banknote,
  QrCode,
  Truck,
  ShieldCheck,
  Check,
  Store,
  Zap,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type PaymentMethod = "pix" | "credit" | "debit" | "cash";
type DeliveryOption = "standard" | "express" | "pickup";

const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "pix", label: "PIX", icon: <QrCode className="w-5 h-5" />, description: "Aprovação instantânea • 5% off" },
  { id: "credit", label: "Cartão de Crédito", icon: <CreditCard className="w-5 h-5" />, description: "Até 12x sem juros" },
  { id: "debit", label: "Cartão de Débito", icon: <CreditCard className="w-5 h-5" />, description: "Débito na hora" },
  { id: "cash", label: "Dinheiro", icon: <Banknote className="w-5 h-5" />, description: "Pague na entrega" },
];

const deliveryOptions: {
  id: DeliveryOption;
  label: string;
  description: string;
  fee: number;
  icon: React.ReactNode;
}[] = [
  { id: "standard", label: "Entrega padrão", description: "Hoje, 45-60 min", fee: 12, icon: <Truck className="w-5 h-5" /> },
  { id: "express", label: "Entrega expressa", description: "Hoje, 20-30 min", fee: 22, icon: <Zap className="w-5 h-5" /> },
  { id: "pickup", label: "Retirar na loja", description: "Pronto em 30 min", fee: 0, icon: <Store className="w-5 h-5" /> },
];

const VALID_COUPONS: Record<string, number> = {
  BUILDR10: 0.1,
  PRIMEIRA: 0.15,
};

const stepLabels = ["Endereço", "Entrega", "Pagamento", "Revisão"];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    street: "Rua Exemplo, 123",
    neighborhood: "Centro",
    complement: "",
  });
  const [delivery, setDelivery] = useState<DeliveryOption>("standard");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("pix");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; pct: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = useMemo(
    () => deliveryOptions.find((d) => d.id === delivery)?.fee ?? 0,
    [delivery]
  );
  const pixDiscount = selectedPayment === "pix" ? subtotal * 0.05 : 0;
  const couponDiscount = appliedCoupon ? subtotal * appliedCoupon.pct : 0;
  const total = Math.max(0, subtotal + deliveryFee - pixDiscount - couponDiscount);

  useEffect(() => {
    if (!user) navigate("/auth");
    else if (items.length === 0) navigate("/carrinho");
  }, [user, items.length, navigate]);

  if (!user || items.length === 0) return null;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, pct: VALID_COUPONS[code] });
      toast.success(`Cupom ${code} aplicado!`);
    } else {
      toast.error("Cupom inválido");
    }
  };

  const canAdvance = () => {
    if (step === 0) return address.street.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (!canAdvance()) {
      toast.error("Preencha as informações para continuar");
      return;
    }
    setStep((s) => Math.min(s + 1, stepLabels.length - 1));
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    const orderNumber = `OC-${Math.floor(Math.random() * 9000 + 1000)}`;
    setIsProcessing(false);
    clearCart();
    navigate("/pedido-confirmado", {
      state: {
        orderNumber,
        total,
        delivery: deliveryOptions.find((d) => d.id === delivery)?.label,
        payment: paymentMethods.find((p) => p.id === selectedPayment)?.label,
      },
    });
  };

  return (
    <div className="flex flex-col pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
        <button
          onClick={() => (step === 0 ? navigate(-1) : setStep((s) => s - 1))}
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">Finalizar Pedido</h1>
      </div>

      {/* Stepper */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          {stepLabels.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={label} className="flex-1 flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                      done
                        ? "bg-primary text-primary-foreground"
                        : active
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span
                    className={`text-[9px] mt-1 font-semibold ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 -mt-4 ${
                      i < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Step 0: Address */}
        {step === 0 && (
          <div className="bg-card rounded-xl p-4 shadow-card flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <p className="text-xs font-bold text-foreground">Endereço de entrega</p>
            </div>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Rua e número"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
              <Input
                placeholder="Bairro"
                value={address.neighborhood}
                onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
              />
              <Input
                placeholder="Complemento (opcional)"
                value={address.complement}
                onChange={(e) => setAddress({ ...address, complement: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 1: Delivery */}
        {step === 1 && (
          <div className="bg-card rounded-xl p-4 shadow-card flex flex-col gap-2">
            <p className="text-xs font-bold text-foreground mb-1">Tipo de entrega</p>
            {deliveryOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDelivery(opt.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  delivery === opt.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/50"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    delivery === opt.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {opt.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-bold text-foreground">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground">{opt.description}</p>
                </div>
                <p className="text-xs font-extrabold text-foreground">
                  {opt.fee === 0 ? "Grátis" : `R$ ${opt.fee.toFixed(2).replace(".", ",")}`}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Payment + Coupon */}
        {step === 2 && (
          <>
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
                        : "border-transparent bg-muted/50"
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

            <div className="bg-card rounded-xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-primary" />
                <p className="text-xs font-bold text-foreground">Cupom de desconto</p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite seu cupom"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="h-10"
                />
                <Button onClick={applyCoupon} variant="outline" className="h-10">
                  Aplicar
                </Button>
              </div>
              {appliedCoupon && (
                <p className="text-[10px] text-green-600 font-semibold mt-2">
                  ✓ Cupom {appliedCoupon.code} ({(appliedCoupon.pct * 100).toFixed(0)}% off)
                </p>
              )}
              <p className="text-[9px] text-muted-foreground mt-2">
                Experimente: BUILDR10 ou PRIMEIRA
              </p>
            </div>
          </>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <>
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-xs font-bold text-foreground mb-2">Endereço</p>
              <p className="text-[11px] text-muted-foreground">
                {address.street} • {address.neighborhood}
                {address.complement && ` • ${address.complement}`}
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-xs font-bold text-foreground mb-2">Entrega & Pagamento</p>
              <p className="text-[11px] text-muted-foreground">
                {deliveryOptions.find((d) => d.id === delivery)?.label} •{" "}
                {paymentMethods.find((p) => p.id === selectedPayment)?.label}
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-xs font-bold text-foreground mb-3">
                Itens ({items.length})
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
          </>
        )}

        {/* Persistent summary */}
        <div className="bg-card rounded-xl p-4 shadow-card flex flex-col gap-2">
          <p className="text-xs font-bold text-foreground mb-1">Resumo</p>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Taxa de entrega</span>
            <span>
              {deliveryFee === 0 ? "Grátis" : `R$ ${deliveryFee.toFixed(2).replace(".", ",")}`}
            </span>
          </div>
          {pixDiscount > 0 && (
            <div className="flex justify-between text-[11px] text-green-600 font-semibold">
              <span>Desconto PIX (5%)</span>
              <span>- R$ {pixDiscount.toFixed(2).replace(".", ",")}</span>
            </div>
          )}
          {couponDiscount > 0 && (
            <div className="flex justify-between text-[11px] text-green-600 font-semibold">
              <span>Cupom {appliedCoupon?.code}</span>
              <span>- R$ {couponDiscount.toFixed(2).replace(".", ",")}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between mt-1">
            <span className="text-sm font-extrabold text-foreground">Total</span>
            <span className="text-sm font-extrabold text-primary">
              R$ {total.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background border-t border-border p-4 z-20">
        {step < stepLabels.length - 1 ? (
          <Button
            onClick={handleNext}
            className="w-full h-12 gradient-primary text-primary-foreground font-bold text-sm rounded-xl"
          >
            Continuar
          </Button>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
