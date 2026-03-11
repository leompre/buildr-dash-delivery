import HeroBanner from "@/components/HeroBanner";
import CategoryScroll from "@/components/CategoryScroll";
import OfferSection from "@/components/OfferSection";
import StoreSection from "@/components/StoreSection";

const Index = () => {
  return (
    <div className="flex flex-col gap-5 pb-4">
      <HeroBanner />
      <CategoryScroll />
      <OfferSection />
      <StoreSection />
    </div>
  );
};

export default Index;
