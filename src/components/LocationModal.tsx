import { useState } from "react";
import { MapPin, Navigation, Search, X, Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
}

const CITIES = [
  { city: "São Paulo", state: "SP", neighborhoods: ["Centro", "Pinheiros", "Moema", "Vila Mariana", "Tatuapé", "Santana"] },
  { city: "Rio de Janeiro", state: "RJ", neighborhoods: ["Centro", "Copacabana", "Botafogo", "Tijuca", "Barra da Tijuca"] },
  { city: "Belo Horizonte", state: "MG", neighborhoods: ["Centro", "Savassi", "Funcionários", "Pampulha"] },
  { city: "Curitiba", state: "PR", neighborhoods: ["Centro", "Batel", "Água Verde", "Santa Felicidade"] },
];

const LocationModal = ({ open, onClose, onSelectLocation }: LocationModalProps) => {
  const [tab, setTab] = useState<"gps" | "cep" | "manual">("gps");
  const [cep, setCep] = useState("");
  const [cepResult, setCepResult] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsResult, setGpsResult] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<typeof CITIES[0] | null>(null);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada neste navegador.");
      return;
    }
    setGpsLoading(true);
    setGpsResult(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt-BR`
          );
          const data = await res.json();
          const address = data.address;
          const loc = `${address.suburb || address.neighbourhood || address.city_district || ""}, ${address.city || address.town || address.village || ""} - ${address.state || ""}`.replace(/^, /, "");
          setGpsResult(loc);
        } catch {
          setGpsResult("Localização detectada");
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setGpsLoading(false);
        alert("Não foi possível obter sua localização. Verifique as permissões.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCepSearch = async () => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;
    setCepLoading(true);
    setCepResult(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepResult("CEP não encontrado");
      } else {
        setCepResult(`${data.bairro}, ${data.localidade} - ${data.uf}`);
      }
    } catch {
      setCepResult("Erro ao buscar CEP");
    } finally {
      setCepLoading(false);
    }
  };

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return digits;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-md rounded-2xl p-0 gap-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-base font-bold text-foreground">
            Escolher localização
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {([
            { key: "gps" as const, label: "GPS", icon: Navigation },
            { key: "cep" as const, label: "CEP", icon: Search },
            { key: "manual" as const, label: "Cidade", icon: MapPin },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${
                tab === key
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-4 min-h-[200px]">
          {/* GPS Tab */}
          {tab === "gps" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Detecte sua localização automaticamente para encontrar lojas próximas.
              </p>
              <Button
                onClick={handleGeolocate}
                disabled={gpsLoading}
                className="w-full gap-2"
              >
                {gpsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                {gpsLoading ? "Detectando..." : "Usar minha localização"}
              </Button>
              {gpsResult && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium flex-1">{gpsResult}</span>
                  <button
                    onClick={() => {
                      onSelectLocation(gpsResult);
                      onClose();
                    }}
                    className="text-primary"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CEP Tab */}
          {tab === "cep" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Informe seu CEP para definir a região de entrega.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(formatCep(e.target.value))}
                  className="flex-1 h-10 px-3 rounded-xl bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={9}
                />
                <Button
                  onClick={handleCepSearch}
                  disabled={cep.replace(/\D/g, "").length !== 8 || cepLoading}
                  size="default"
                >
                  {cepLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
                </Button>
              </div>
              {cepResult && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium flex-1">{cepResult}</span>
                  {!cepResult.includes("não encontrado") && !cepResult.includes("Erro") && (
                    <button
                      onClick={() => {
                        onSelectLocation(cepResult);
                        onClose();
                      }}
                      className="text-primary"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Manual Tab */}
          {tab === "manual" && (
            <div className="space-y-3">
              {!selectedCity ? (
                <>
                  <p className="text-sm text-muted-foreground">Selecione sua cidade:</p>
                  <div className="space-y-2">
                    {CITIES.map((c) => (
                      <button
                        key={c.city}
                        onClick={() => setSelectedCity(c)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/70 transition-colors text-left"
                      >
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm font-medium">
                          {c.city} - {c.state}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="text-xs text-primary font-semibold flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Voltar
                  </button>
                  <p className="text-sm text-muted-foreground">
                    Selecione o bairro em {selectedCity.city}:
                  </p>
                  <div className="space-y-2">
                    {selectedCity.neighborhoods.map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          onSelectLocation(`${n}, ${selectedCity.city} - ${selectedCity.state}`);
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/70 transition-colors text-left"
                      >
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium">{n}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;
