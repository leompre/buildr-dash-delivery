import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, SlidersHorizontal, Star, ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products, stores, categories } from "@/data/mockData";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const RECENT_KEY = "buildr:recent-searches";
const MAX_RECENTS = 6;

const loadRecents = (): string[] => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const SearchOverlay = ({ open, onClose, initialQuery = "" }: SearchOverlayProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc" | "rating">("relevance");
  const [recents, setRecents] = useState<string[]>(loadRecents);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (open) {
      setQuery(initialQuery);
      setRecents(loadRecents());
    }
  }, [open, initialQuery]);

  const saveRecent = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recents.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENTS);
    setRecents(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
  };

  const clearRecents = () => {
    setRecents([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* noop */
    }
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (priceRange[1] < 500 ? 1 : 0) +
    (sortBy !== "relevance" ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 500]);
    setMinRating(0);
    setSortBy("relevance");
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.store.toLowerCase().includes(query.toLowerCase());
      const matchCategory = !selectedCategory || p.category === selectedCategory;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchRating = p.rating >= minRating;
      return matchQuery && matchCategory && matchPrice && matchRating;
    });

    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [query, selectedCategory, priceRange, minRating, sortBy]);

  const filteredStores = useMemo(() => {
    if (!query) return [];
    return stores.filter(
      (s) => s.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);
  }, [query]);

  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    const productNames = products
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .map((p) => p.name)
      .slice(0, 4);
    const storeNames = stores
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      .map((s) => s.name)
      .slice(0, 2);
    return [...new Set([...productNames, ...storeNames])];
  }, [query]);

  if (!open) return null;

  const showResults = query.length >= 2;

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col max-w-md mx-auto">
      {/* Search header */}
      <div className="gradient-primary px-3 pt-3 pb-3 flex items-center gap-2">
        <button onClick={onClose} className="text-primary-foreground p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar materiais ou lojas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-10 rounded-xl bg-card text-card-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative p-2 rounded-lg transition-colors ${showFilters ? "bg-primary-foreground/20" : ""} text-primary-foreground`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && !showFilters && (
        <div className="bg-card border-b border-border px-3 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold whitespace-nowrap"
            >
              {categories.find((c) => c.id === selectedCategory)?.name}
              <X className="w-3 h-3" />
            </button>
          )}
          {minRating > 0 && (
            <button
              onClick={() => setMinRating(0)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold whitespace-nowrap"
            >
              {minRating}+ <Star className="w-2.5 h-2.5 fill-current" />
              <X className="w-3 h-3" />
            </button>
          )}
          {priceRange[1] < 500 && (
            <button
              onClick={() => setPriceRange([0, 500])}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold whitespace-nowrap"
            >
              Até R$ {priceRange[1]} <X className="w-3 h-3" />
            </button>
          )}
          {sortBy !== "relevance" && (
            <button
              onClick={() => setSortBy("relevance")}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold whitespace-nowrap"
            >
              {sortBy === "price_asc" ? "Menor preço" : sortBy === "price_desc" ? "Maior preço" : "Avaliação"}
              <X className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={clearAllFilters}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-muted-foreground whitespace-nowrap"
          >
            Limpar
          </button>
        </div>
      )}

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-card border-b border-border p-4 space-y-4 animate-in slide-in-from-top-2">
          {/* Categories */}
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Categoria</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  !selectedCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                Todas
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedCategory === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">
              Faixa de preço: R$ {priceRange[0]} - R$ {priceRange[1]}
            </p>
            <input
              type="range"
              min={0}
              max={500}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-primary"
            />
          </div>

          {/* Rating */}
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Avaliação mínima</p>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    minRating === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {r === 0 ? "Todas" : <><Star className="w-3 h-3 fill-current" /> {r}+</>}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Ordenar por</p>
            <div className="flex flex-wrap gap-2">
              {([
                { key: "relevance" as const, label: "Relevância" },
                { key: "price_asc" as const, label: "Menor preço" },
                { key: "price_desc" as const, label: "Maior preço" },
                { key: "rating" as const, label: "Avaliação" },
              ]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    sortBy === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Suggestions (autocomplete) */}
        {!showResults && suggestions.length === 0 && (
          <div className="p-4 space-y-5">
            {recents.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Buscas recentes
                  </p>
                  <button onClick={clearRecents} className="text-[11px] text-primary font-semibold">
                    Limpar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recents.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-semibold hover:bg-secondary transition-colors"
                    >
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                Buscas populares
              </p>
              <div className="flex flex-wrap gap-2">
                {["Cimento", "Tintas", "Ferramentas", "Porcelanato", "Fio elétrico"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {query.length >= 1 && query.length < 2 && suggestions.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Digite pelo menos 2 caracteres...
          </div>
        )}

        {/* Autocomplete suggestions */}
        {!showResults && suggestions.length > 0 && (
          <div className="p-4 space-y-1">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-muted transition-colors"
              >
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-left">{s}</span>
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="p-4 space-y-5">
            {/* Store results */}
            {filteredStores.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Lojas</p>
                <div className="space-y-2">
                  {filteredStores.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => {
                        if (query) saveRecent(query);
                        onClose();
                        navigate(`/loja/${store.id}`);
                      }}
                      className="flex items-center gap-3 w-full p-3 rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow"
                    >
                      <img src={store.image} alt={store.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold">{store.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="w-3 h-3 fill-accent text-accent" /> {store.rating} • {store.deliveryTime}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product results */}
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                Produtos ({filteredProducts.length})
              </p>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>
                  <p className="text-xs text-muted-foreground mt-1">Tente ajustar os filtros ou buscar outro termo.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        if (query) saveRecent(query);
                        onClose();
                        navigate(`/produto/${product.id}`);
                      }}
                      className="flex items-center gap-3 w-full p-3 rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow text-left"
                    >
                      <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.store}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-extrabold text-primary">
                            R$ {product.price.toFixed(2).replace(".", ",")}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        {product.rating}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
