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

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  badge: string | null;
  images: string[] | null;
}

const ProductShowcase = () => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { currency } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.products.getFeatured(language);
        setProducts(data.slice(0, 8));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [language]);

  if (loading) {
    return (
      <section id="store" className="py-16 bg-background">
        <div className="px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Store</h2>
            <p className="text-xl text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="store" className="py-16 bg-background">
        <div className="px-8 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t("home.store.title")}</h2>
          </div>
          <Button
            variant="ghost"
            className="hidden md:flex items-center gap-2"
            onClick={() => router.push("/shop")}
          >
            {t("home.viewAll")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="overflow-x-auto md:overflow-x-visible -mx-8 sm:-mx-12 lg:-mx-16 md:mx-0 px-8 sm:px-12 lg:px-16 md:px-0">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 min-w-max md:min-w-0">
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[280px] md:w-auto">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  tagline={product.description || ""}
                  price={`${t("product.from")} ${formatPrice(product.price, currency)}`}
                  badge={product.badge || undefined}
                  gradient="bg-gradient-to-br from-muted to-background"
                  images={product.images || []}
                  image={product.images?.[0] || null}
                  slug={product.slug}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
