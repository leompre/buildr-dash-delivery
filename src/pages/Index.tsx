import HeroBanner from "@/components/HeroBanner";
import CategoryScroll from "@/components/CategoryScroll";
import OfferSection from "@/components/OfferSection";
import StoreSection from "@/components/StoreSection";
import ReorderStrip from "@/components/ReorderStrip";

const Index = () => {
  return (
    <div className="flex flex-col gap-5 pb-4">
      <HeroBanner />
      <CategoryScroll />
      <ReorderStrip />
      <OfferSection />
      <StoreSection />
    </div>
  );
};

export default Index;
