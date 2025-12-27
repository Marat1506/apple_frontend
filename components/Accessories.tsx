"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
        <div className="flex items-center justify-between mb-12 animate-fade-in-up pr-0">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground">
            {t("home.accessories.title") || "Accessories"}
          </h2>
          <Button
            variant="link"
            className="text-primary hover:text-primary/80 group flex items-center text-sm sm:text-base"
            onClick={() => router.push("/shop")}
          >
            {t("home.viewAll")}
            <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>


        {/* Accessories - Horizontal Scrollable on Mobile, Grid on Desktop */}
        <div className="overflow-x-auto md:overflow-x-visible -mx-8 sm:-mx-12 lg:-mx-16 md:mx-0 px-8 sm:px-12 lg:px-16 md:px-0">
          <div className="flex md:grid md:grid-cols-[1.5fr_1fr_1fr] lg:grid-cols-[1.5fr_1fr_1fr] gap-6 md:gap-6 min-w-max md:min-w-0">
            {/* First Card - Product Card with Special Design */}
            {accessories.length > 0 && (
              <div className="flex-shrink-0 w-[320px] md:w-auto">
                <Card 
                  className="group overflow-hidden hover-lift border-border/50 bg-card cursor-pointer h-full flex flex-col"
                  onClick={() => router.push(`/product/${accessories[0].slug}`)}
                >
                  {/* Text Content at Top */}
                  <CardContent className="p-6 pb-2 space-y-3">
                    <h3 className="text-2xl font-bold text-foreground leading-tight">
                      {accessories[0].name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {accessories[0].description}
                    </p>
                    <p className="text-lg font-semibold text-foreground pt-1">
                      {`${t("product.from")} ${formatPrice(accessories[0].price, currency)}`}
                    </p>
                  </CardContent>

                  {/* Image at Bottom */}
                  <CardHeader className="relative h-64 p-0 overflow-hidden flex-grow">
                    <div className="w-full h-full bg-gradient-to-br from-muted to-background flex items-center justify-center relative">
                      {/* Product image or placeholder */}
                      {accessories[0].images && accessories[0].images.length > 0 ? (
                        <img
                          src={accessories[0].images[0]}
                          alt={accessories[0].name}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-8">
                          <div className="text-center space-y-4">
                            <div className="w-32 h-32 mx-auto rounded-3xl bg-background/20 backdrop-blur-sm animate-float" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              </div>
            )}

            {/* Product Cards */}
            {accessories.slice(1).map((accessory, index) => (
              <div key={accessory.id} className="flex-shrink-0 w-[280px] md:w-auto">
                <ProductCard
                  id={accessory.id}
                  name={accessory.name}
                  tagline={accessory.description || ""}
                  price={`${t("product.from")} ${formatPrice(accessory.price, currency)}`}
                  badge={undefined}
                  gradient="bg-gradient-to-br from-muted to-background"
                  images={accessory.images || []}
                  image={accessory.images?.[0] || null}
                  slug={accessory.slug}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accessories;
