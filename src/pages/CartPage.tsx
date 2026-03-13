import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, clearCart, subtotal } = useCart();
  const { user } = useAuth();

  const deliveryFee = items.length > 0 ? 12.0 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!user) {
      toast.error("Faça login para finalizar o pedido");
      navigate("/auth");
      return;
    }
    toast.success("Pedido realizado com sucesso! 🎉");
    clearCart();
    navigate("/rastreamento");
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-extrabold text-foreground">🛒 Carrinho</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <ShoppingCart className="w-16 h-16 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground font-semibold">Seu carrinho está vazio</p>
          <Button
            onClick={() => navigate("/")}
            className="gradient-primary text-primary-foreground font-bold rounded-xl"
          >
            Explorar produtos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">🛒 Carrinho</h1>
        <span className="text-xs text-muted-foreground ml-auto">
          {items.length} {items.length === 1 ? "item" : "itens"}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-3 bg-card rounded-xl p-3 shadow-card">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{item.product.name}</p>
              <p className="text-[10px] text-muted-foreground">{item.product.store}</p>
              <p className="text-sm font-extrabold text-primary mt-1">
                R$ {(item.product.price * item.qty).toFixed(2).replace(".", ",")}
              </p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeItem(item.product.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
                <button onClick={() => updateQty(item.product.id, item.qty - 1)}>
                  <Minus className="w-3 h-3 text-foreground" />
                </button>
                <span className="text-xs font-bold text-foreground w-4 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.product.id, item.qty + 1)}>
                  <Plus className="w-3 h-3 text-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="bg-card rounded-xl p-4 shadow-card mt-2 flex flex-col gap-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Taxa de entrega</span>
            <span>R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="text-sm font-extrabold text-foreground">Total</span>
            <span className="text-sm font-extrabold text-primary">
              R$ {total.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        <Button
          onClick={handleCheckout}
          className="w-full h-12 gradient-primary text-primary-foreground font-bold text-sm rounded-xl mt-2"
        >
          Finalizar Pedido
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
