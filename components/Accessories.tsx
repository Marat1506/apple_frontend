"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/currency";

interface Accessory {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
}

const Accessories = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { currency } = useCurrency();
  const [accessories, setAccessories] = useState<Accessory[]>([]);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const allProducts = await api.products.getAll(language);
        const nonFeatured = allProducts.filter((p: any) => !p.featured).slice(0, 3);
        setAccessories(nonFeatured);
      } catch (error) {
        console.error("Error fetching accessories:", error);
      }
    };

    fetchAccessories();
  }, [language]);

  return (
    <section className="py-24 bg-muted/30">
      <div className="px-8 sm:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            {t("home.accessories.title") || "Accessories"}
          </h2>
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 group hidden md:flex items-center"
            onClick={() => router.push("/shop")}
          >
            {t("home.viewAll")}
            <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Mobile: Link below title */}
        <div className="mb-8 md:hidden">
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 group p-0"
            onClick={() => router.push("/shop")}
          >
            {t("home.viewAll")}
            <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Subtitle */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {t("home.accessories.subtitle") || "Here and wow."}
          </h3>
          <p className="text-muted-foreground">
            {t("home.accessories.description") || "The accessories you love. In a new mix of colors and textures."}
          </p>
        </div>

        {/* Accessories - Horizontal Scrollable on Mobile, Grid on Desktop */}
        <div className="overflow-x-auto md:overflow-x-visible -mx-8 sm:-mx-12 lg:-mx-16 md:mx-0 px-8 sm:px-12 lg:px-16 md:px-0">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-w-max md:min-w-0">
            {accessories.map((accessory, index) => (
              <div
                key={accessory.id}
                className="group cursor-pointer animate-fade-in-up flex-shrink-0 w-[280px] md:w-auto"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => router.push(`/product/${accessory.slug}`)}
              >
                <div className="bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 hover-lift h-full flex flex-col">
                  {/* Product Image */}
                  <div className="aspect-square bg-muted/50 flex items-center justify-center p-8">
                    {accessory.images && accessory.images.length > 0 ? (
                      <img
                        src={accessory.images[0]}
                        alt={accessory.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                        <span className="text-4xl font-bold text-gradient">
                          {accessory.name.substring(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="mb-2">
                      <span className="inline-block text-xs font-semibold text-primary mb-1">
                        New
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {accessory.name}
                    </h3>
                    <p className="text-xl font-semibold text-foreground mb-4">
                      {formatPrice(accessory.price, currency)}
                    </p>
                    
                    {/* Color dots */}
                    <div className="flex gap-2 mt-auto">
                      {[
                        { color: "#1E3A8A", name: "blue" },
                        { color: "#FF6B35", name: "orange" },
                        { color: "#10B981", name: "green" },
                        { color: "#3B82F6", name: "light-blue" },
                      ].map((option, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-border/50"
                          style={{ backgroundColor: option.color }}
                          title={option.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accessories;
