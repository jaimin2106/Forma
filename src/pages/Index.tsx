
import { useAuth } from "@/hooks/useAuth";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { DataGatheringSection } from "@/components/landing/DataGatheringSection";
import { CustomizableSection } from "@/components/landing/CustomizableSection";
import { TemplatesSection } from "@/components/landing/TemplatesSection";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { CollaborativeSection } from "@/components/landing/CollaborativeSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Footer } from "@/components/landing/Footer";





const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <HeroSection user={user} />
      <TrustSection />
      <DataGatheringSection />
      <CustomizableSection />
      <TemplatesSection />
      <SecuritySection />
      <CollaborativeSection />
      <IntegrationsSection />
      <HowItWorksSection />
      <TestimonialSection />
      <FinalCTASection user={user} />
      <Footer/>
    </div>
  );
};

export default Index;
