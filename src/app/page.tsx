import Navbar from "@/components/navbar/Navbar";
import HeroLanding from "@/components/HeroLanding";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CTASection } from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroLanding />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
