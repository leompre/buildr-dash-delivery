import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const cartItems = [
  { product: products[0], qty: 2 },
  { product: products[1], qty: 5 },
];

const CartPage = () => {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const deliveryFee = 12.0;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">🛒 Carrinho</h1>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex gap-3 bg-card rounded-xl p-3 shadow-card">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">{item.product.name}</p>
              <p className="text-[10px] text-muted-foreground">{item.product.store}</p>
              <p className="text-sm font-extrabold text-primary mt-1">
                R$ {item.product.price.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
                <Minus className="w-3 h-3 text-foreground" />
                <span className="text-xs font-bold text-foreground">{item.qty}</span>
                <Plus className="w-3 h-3 text-foreground" />
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

        <Button className="w-full h-12 gradient-primary text-primary-foreground font-bold text-sm rounded-xl mt-2">
          Finalizar Pedido
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
