import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BarbersSection from "@/components/BarbersSection";
import ServicesSection from "@/components/ServicesSection";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";
import NotificationBanner from "@/components/NotificationBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="grain-overlay" />
      <NotificationBanner />
      <Navbar />
      <HeroSection />
      <div className="glow-line" />
      <BarbersSection />
      <div className="glow-line" />
      <ServicesSection />
      <BookingCTA />
      <Footer />
    </div>
  );
};

export default Index;
