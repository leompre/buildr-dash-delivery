import { Minus, Plus, Trash2, Bookmark } from "lucide-react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import type { CartItem } from "@/contexts/CartContext";

interface Props {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onSaveForLater: () => void;
}

const CartItemRow = ({ item, onIncrement, onDecrement, onRemove, onSaveForLater }: Props) => {
  const x = useMotionValue(0);
  const bgOpacity = useTransform(x, [-120, -40, 0], [1, 0.4, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -100) {
      onRemove();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -300, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className="relative overflow-hidden rounded-xl"
    >
      {/* swipe-to-delete background */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-destructive flex items-center justify-end pr-6"
      >
        <Trash2 className="w-5 h-5 text-destructive-foreground" />
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.6, right: 0 }}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className="relative bg-card rounded-xl p-3 shadow-card flex gap-3 cursor-grab active:cursor-grabbing"
      >
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-16 h-16 rounded-lg object-cover pointer-events-none"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground truncate">{item.product.name}</p>
          <p className="text-[10px] text-muted-foreground">{item.product.store}</p>
          <p className="text-sm font-extrabold text-primary mt-1">
            R$ {(item.product.price * item.qty).toFixed(2).replace(".", ",")}
          </p>
          <button
            onClick={onSaveForLater}
            className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <Bookmark className="w-3 h-3" />
            Salvar para depois
          </button>
        </div>
        <div className="flex flex-col items-end justify-between">
          <button
            onClick={onRemove}
            aria-label="Remover"
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
            <button onClick={onDecrement} aria-label="Diminuir" className="active:scale-90 transition-transform">
              <Minus className="w-3 h-3 text-foreground" />
            </button>
            <motion.span
              key={item.qty}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="text-xs font-bold text-foreground w-4 text-center"
            >
              {item.qty}
            </motion.span>
            <button onClick={onIncrement} aria-label="Aumentar" className="active:scale-90 transition-transform">
              <Plus className="w-3 h-3 text-foreground" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CartItemRow;
