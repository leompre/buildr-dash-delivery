import { Search, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import logoIcon from "@/assets/obracerta-icon.png";
import LocationModal from "./LocationModal";
import SearchOverlay from "./SearchOverlay";

const AppHeader = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState("São Paulo, SP");

  return (
    <>
      <header className="gradient-primary sticky top-0 z-50">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img src={logoIcon} alt="ObraCerta" className="w-8 h-8 rounded-full" />
              <h1 className="text-lg font-extrabold text-primary-foreground tracking-tight">
                ObraCerta
              </h1>
            </div>
            <button
              onClick={() => setLocationOpen(true)}
              className="flex items-center gap-1 text-primary-foreground/90 text-xs hover:text-primary-foreground transition-colors active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="max-w-[140px] truncate">{location}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={() => setSearchOpen(true)}
            className="relative w-full"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <div className="w-full h-10 pl-9 pr-4 rounded-xl bg-card text-muted-foreground text-sm flex items-center">
              Buscar materiais ou lojas...
            </div>
          </button>
        </div>
      </header>

      <LocationModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        onSelectLocation={setLocation}
      />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
};

export default AppHeader;
