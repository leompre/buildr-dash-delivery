import { User, Package, MapPin, CreditCard, HelpCircle, LogOut, ChevronRight, Star } from "lucide-react";
import logoIcon from "@/assets/obracerta-icon.png";

const menuItems = [
  { icon: Package, label: "Meus Pedidos", badge: "2" },
  { icon: MapPin, label: "Endereços" },
  { icon: CreditCard, label: "Pagamento" },
  { icon: Star, label: "Programa de Fidelidade", badge: "Novo" },
  { icon: HelpCircle, label: "Ajuda" },
];

const ProfilePage = () => {
  return (
    <div className="flex flex-col">
      {/* Profile Header */}
      <div className="gradient-primary px-4 py-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-card/20 flex items-center justify-center">
          <User className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <p className="text-base font-extrabold text-primary-foreground">João da Silva</p>
          <p className="text-xs text-primary-foreground/80">joao@email.com</p>
        </div>
      </div>

      {/* Fidelity Card */}
      <div className="mx-4 -mt-3 bg-card rounded-xl p-4 shadow-elevated flex items-center gap-3">
        <img src={logoIcon} alt="ObraCerta" className="w-10 h-10" />
        <div className="flex-1">
          <p className="text-xs font-bold text-foreground">ObraCerta Fidelidade</p>
          <p className="text-[10px] text-muted-foreground">1.250 pontos acumulados</p>
        </div>
        <div className="gradient-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
          Ouro
        </div>
      </div>

      {/* Menu */}
      <div className="p-4 flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-muted transition-colors"
          >
            <item.icon className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-semibold text-foreground text-left">{item.label}</span>
            {item.badge && (
              <span className="gradient-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}

        <button className="flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-muted transition-colors mt-4">
          <LogOut className="w-5 h-5 text-destructive" />
          <span className="text-sm font-semibold text-destructive text-left">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
