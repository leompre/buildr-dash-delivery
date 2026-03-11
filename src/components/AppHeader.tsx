import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import logoIcon from "@/assets/obracerta-icon.png";

const AppHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="gradient-primary sticky top-0 z-50">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src={logoIcon} alt="ObraCerta" className="w-8 h-8 rounded-full" />
            <h1 className="text-lg font-extrabold text-primary-foreground tracking-tight">
              ObraCerta
            </h1>
          </div>
          <div className="flex items-center gap-1 text-primary-foreground/80 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>São Paulo, SP</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar materiais..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-card text-card-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
