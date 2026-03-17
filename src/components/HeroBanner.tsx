import heroBanner from "@/assets/hero-banner.jpg";

const HeroBanner = () => {
  return (
    <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden shadow-elevated">
      <img
        src={heroBanner}
        alt="Materiais de construção"
        className="w-full h-40 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent flex flex-col justify-center p-5">
        <p className="text-primary-foreground text-xs font-semibold mb-1 opacity-90">
          🏠 Tudo para sua obra
        </p>
        <h2 className="text-primary-foreground text-lg font-extrabold leading-tight">
          em um só app!
        </h2>
        <button
          onClick={() => document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-3 gradient-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full w-fit shadow-card"
        >
          Ver Ofertas
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
