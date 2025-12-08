import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { EventsPreview } from "@/components/home/EventsPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <ServicesPreview />
      <EventsPreview />
      <TestimonialsSection />
      <NewsletterSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
