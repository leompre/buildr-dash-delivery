import { ArrowLeft, ShoppingCart, Truck, Bookmark, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import CartItemRow from "@/components/CartItemRow";

const FREE_SHIPPING_THRESHOLD = 150;

const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    savedItems,
    updateQty,
    removeItem,
    saveForLater,
    moveToCart,
    removeSaved,
    subtotal,
  } = useCart();
  const { user } = useAuth();

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = items.length > 0 && !isFreeShipping ? 12.0 : 0;
  const total = subtotal + deliveryFee;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = () => {
    if (!user) {
      toast.error("Faça login para finalizar o pedido");
      navigate("/auth");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={() => navigate(-1)} aria-label="Voltar">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-extrabold text-foreground">🛒 Carrinho</h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <ShoppingCart className="w-16 h-16 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground font-semibold">Seu carrinho está vazio</p>
          <Button
            onClick={() => navigate("/")}
            className="gradient-primary text-primary-foreground font-bold rounded-xl"
          >
            Explorar produtos
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-32">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
        <button onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-extrabold text-foreground">🛒 Carrinho</h1>
        <span className="text-xs text-muted-foreground ml-auto">
          {items.length} {items.length === 1 ? "item" : "itens"}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Free shipping progress */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-3 shadow-card flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              {isFreeShipping ? (
                <p className="text-[11px] font-bold text-green-600">
                  🎉 Você ganhou frete grátis!
                </p>
              ) : (
                <p className="text-[11px] font-semibold text-foreground">
                  Faltam{" "}
                  <span className="text-primary font-extrabold">
                    R$ {remainingForFree.toFixed(2).replace(".", ",")}
                  </span>{" "}
                  para frete grátis
                </p>
              )}
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </motion.div>
        )}

        {/* Cart items */}
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <CartItemRow
              key={item.product.id}
              item={item}
              onIncrement={() => updateQty(item.product.id, item.qty + 1)}
              onDecrement={() => updateQty(item.product.id, item.qty - 1)}
              onRemove={() => removeItem(item.product.id)}
              onSaveForLater={() => saveForLater(item.product.id)}
            />
          ))}
        </AnimatePresence>

        {/* Saved for later */}
        {savedItems.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <Bookmark className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs font-bold text-foreground">
                Salvos para depois ({savedItems.length})
              </p>
            </div>
            <AnimatePresence initial={false}>
              {savedItems.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -200 }}
                  className="flex gap-3 bg-card/60 border border-dashed border-border rounded-xl p-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{item.product.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.product.store}</p>
                    <p className="text-xs font-extrabold text-primary mt-0.5">
                      R$ {(item.product.price * item.qty).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-1">
                    <button
                      onClick={() => removeSaved(item.product.id)}
                      className="text-[10px] text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remover
                    </button>
                    <button
                      onClick={() => moveToCart(item.product.id)}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Mover
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Summary */}
        {items.length > 0 && (
          <motion.div
            layout
            className="bg-card rounded-xl p-4 shadow-card mt-2 flex flex-col gap-2"
          >
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Taxa de entrega</span>
              <span className={isFreeShipping ? "text-green-600 font-bold" : ""}>
                {isFreeShipping ? "Grátis" : `R$ ${deliveryFee.toFixed(2).replace(".", ",")}`}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="text-sm font-extrabold text-foreground">Total</span>
              <motion.span
                key={total}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-sm font-extrabold text-primary"
              >
                R$ {total.toFixed(2).replace(".", ",")}
              </motion.span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky CTA */}
      {items.length > 0 && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-16 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-background via-background to-transparent z-30"
        >
          <Button
            onClick={handleCheckout}
            className="w-full h-12 gradient-primary text-primary-foreground font-bold text-sm rounded-xl shadow-lg"
          >
            Finalizar • R$ {total.toFixed(2).replace(".", ",")}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CartPage;
