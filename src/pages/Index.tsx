import Navbar from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { PricingSection } from '@/components/PricingSection';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onUploadClick={() => {}} />
      <FeaturesSection />
      <PricingSection />
    </div>
  );
}