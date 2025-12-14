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
    buttonText: t("hero.shopNow"),
    buttonLink: "/shop",
    image: settings?.value?.image || null,
  };

  return (
    <section className="relative bg-black text-white overflow-hidden">
      <div className="max-w-[980px] mx-auto px-6 pt-32 pb-20 text-center">
        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 animate-fade-in-up">
          {heroData.title}
        </h1>

        {/* Tagline */}
        <p className="text-2xl sm:text-3xl text-white/90 mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {heroData.subtitle}
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Button 
            size="lg" 
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white border-0 rounded-full px-6 py-2.5 text-[17px] font-normal transition-colors"
            onClick={() => router.push(heroData.buttonLink)}
          >
            {heroData.buttonText}
          </Button>
        </div>

        {/* Hero Image */}
        <div className="relative animate-scale-in" style={{ animationDelay: "0.3s" }}>
          <div className="relative mx-auto max-w-4xl">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black">
              {heroData.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || ""}${heroData.image}`}
                  alt="Hero"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                // Fallback: Premium gradient background
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-white/60 text-sm">{t("hero.uploadImage")}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-purple-400/20 to-blue-500/20 blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;