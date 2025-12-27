"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSettings {
  id: string;
  key: string;
  value: {
    image: string | null;
    imageDesktop: string | null;
    imageMobile: string | null;
  };
}

const Hero = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        const response = await api.request("/settings/hero");
        setSettings(response);
      } catch (error) {
        console.error("Error fetching hero settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSettings();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-black text-white overflow-hidden min-h-[600px] flex items-center justify-center">
        <div className="animate-pulse">{t("hero.loading")}</div>
      </section>
    );
  }

  const heroData = {
    title: t("home.hero.title"),
    subtitle: t("home.hero.subtitle"),
    imageDesktop: settings?.value?.imageDesktop || settings?.value?.image || null,
    imageMobile: settings?.value?.imageMobile || settings?.value?.image || null,
  };

  return (
    <section className="relative bg-black text-white overflow-hidden min-h-screen">
      {/* Background Image */}
      {heroData.imageDesktop || heroData.imageMobile ? (
        <div className="absolute inset-0 z-0">
          {heroData.imageDesktop && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL || ""}${heroData.imageDesktop}`}
              alt="Background"
              className="hidden md:block w-full h-full object-cover"
            />
          )}
          {heroData.imageMobile && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL || ""}${heroData.imageMobile}`}
              alt="Background"
              className="md:hidden w-full h-full object-cover"
            />
          )}
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-black" />
      )}
      
      <div className="relative z-10 px-8 sm:px-12 lg:px-16 pt-32 pb-20 text-center">
        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 animate-fade-in-up">
          {heroData.title}
        </h1>

        {/* Tagline */}
        <p className="text-2xl sm:text-3xl text-white/90 mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {heroData.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-transparent hover:bg-white/10 text-white border-white/30 rounded-full px-6 py-2.5 text-[17px] font-normal transition-colors"
            onClick={() => router.push("/about")}
          >
            {t("hero.learnMore")}
          </Button>
          <Button 
            size="lg" 
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white border-0 rounded-full px-6 py-2.5 text-[17px] font-normal transition-colors"
            onClick={() => router.push("/shop")}
          >
            {t("hero.buy")}
          </Button>
        </div>

      </div>
    </section>
  );
};

export default Hero;