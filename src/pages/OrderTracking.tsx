import { ArrowLeft, Package, CheckCircle, Truck, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  { icon: CheckCircle, label: "Pedido confirmado", time: "14:30", done: true },
  { icon: Package, label: "Loja preparando", time: "14:45", done: true },
  { icon: Truck, label: "Entregador a caminho", time: "15:10", done: true },
  { icon: MapPin, label: "Entrega concluída", time: "--:--", done: false },
];

const OrderTracking = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col pb-20">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">📦 Rastreamento</h1>
      </div>

      {/* Map placeholder */}
      <div className="mx-4 mt-4 h-44 rounded-2xl bg-muted flex items-center justify-center shadow-card overflow-hidden">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Mapa em tempo real</p>
          <p className="text-[10px] text-muted-foreground">Entregador está a 5 min de você</p>
        </div>
      </div>

      {/* Steps */}
      <div className="p-4">
        <h3 className="text-sm font-extrabold text-foreground mb-4">Status do Pedido</h3>
        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.done ? "gradient-primary" : "bg-muted"
                  }`}
                >
                  <step.icon className={`w-4 h-4 ${step.done ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-0.5 h-8 ${step.done ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
              <div className="pb-6">
                <p className={`text-xs font-bold ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order info */}
      <div className="mx-4 bg-card rounded-xl p-4 shadow-card">
        <p className="text-xs font-bold text-foreground">Pedido #OC-2847</p>
        <p className="text-[10px] text-muted-foreground mt-1">Loja Constrular • 3 itens</p>
        <p className="text-sm font-extrabold text-primary mt-2">R$ 127,60</p>
      </div>
    </div>
  );
};

export default OrderTracking;
