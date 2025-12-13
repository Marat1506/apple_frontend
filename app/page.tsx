import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductShowcase from "@/components/ProductShowcase";
import Accessories from "@/components/Accessories";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function Home() {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Navigation />
      <Hero />
      <Categories />
      <ProductShowcase />
      <Accessories />
      <Features />
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

