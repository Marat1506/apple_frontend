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
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("home.store.title")}</h2>
            <p className="text-xl text-muted-foreground">{t("home.store.subtitle")}</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              tagline={product.description || ""}
              price={`${t("product.from")} ${formatPrice(product.price, currency)}`}
              badge={product.badge || undefined}
              gradient="bg-gradient-to-br from-muted to-background"
              image={product.images?.[0] || null}
              slug={product.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
