"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import ProductConfigurator from "@/components/ProductConfigurator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FavoriteButton } from "@/components/FavoriteButton";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  badge: string | null;
  specs: any;
  stock: number;
  variants: {
    colors?: Array<{ id: string; name: string; hex: string }>;
    storage?: string[];
    versions?: string[];
  };
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const { currency } = useCurrency();
  const { t, language } = useLanguage();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<{
    color?: string;
    storage?: string;
    version?: string;
  }>({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.products.getBySlug(slug, language);
        setProduct(data);
        // Set default variants
        if (data.variants?.colors?.[0]) {
          setSelectedVariant({ color: data.variants.colors[0].id });
        }
      } catch (error: any) {
        toast({
          title: t("common.error"),
          description: t("common.productNotFound"),
          variant: "destructive",
        });
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchProduct();
    }
  }, [slug, router, t, language]);

  const addToCart = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    setAdding(true);
    try {
      await api.cart.add(product!.id, 1, selectedVariant);
      await refreshCart();
      toast({
        title: t("product.addedToCart"),
        description: `${product!.name} ${t("product.hasBeenAdded")}`,
      });
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-14 pb-16 md:pb-0">
          <div className="px-8 sm:px-12 lg:px-16 py-12">
            <Skeleton className="h-16 w-3/4 mx-auto mb-8" />
            <Skeleton className="h-96 w-full mb-8" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t("product.notFound")}</h2>
          <Button onClick={() => router.push("/")}>{t("product.goHome")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />

      <main className="pt-14">
        {/* Hero Section */}
        <div className="bg-background">
          <div className="px-8 sm:px-12 lg:px-16 pt-12 pb-16 text-center">
            {product.badge && (
              <div className="mb-4">
                <span className="inline-block text-sm font-semibold text-primary">
                  {product.badge}
                </span>
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
              {product.name}
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <p className="text-3xl font-semibold text-foreground">
                {t("product.from")} {formatPrice(product.price, currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Product Image Gallery */}
        <div className="bg-background">
          <div className="px-8 sm:px-12 lg:px-16 py-12">
            <div className="relative w-full aspect-[16/10] flex items-center justify-center bg-gradient-to-b from-background to-muted/20 rounded-3xl overflow-hidden">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Product Configurator */}
        {product.variants && Object.keys(product.variants).length > 0 && (
          <div className="bg-background border-t border-border">
            <div className="px-8 sm:px-12 lg:px-16 py-16">
              <ProductConfigurator
                variants={product.variants}
                onVariantChange={setSelectedVariant}
              />
            </div>
          </div>
        )}

        {/* Specifications & Description */}
        <div className="bg-muted/30 border-t border-border">
          <div className="px-8 sm:px-12 lg:px-16 py-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">{t("product.description")}</TabsTrigger>
                <TabsTrigger value="specs">{t("product.specifications")}</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description || t("product.noDescription")}
                </p>
              </TabsContent>
              <TabsContent value="specs" className="mt-6">
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(
                      product.specs as Record<string, string>
                    ).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-4 border-b border-border/50"
                      >
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="font-semibold text-foreground">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {t("product.noSpecifications")}
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-background border-t border-border">
          <div className="px-8 sm:px-12 lg:px-16 py-20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 h-14 text-lg font-medium bg-[#0071e3] hover:bg-[#0077ed] text-white flex-1 sm:flex-none"
                onClick={addToCart}
                disabled={adding || product.stock === 0}
              >
                {adding
                  ? t("product.adding")
                  : product.stock === 0
                  ? t("product.outOfStock")
                  : t("product.addToCart")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-14 text-lg font-medium"
                onClick={() => router.push("/cart")}
              >
                {t("product.viewCart")}
              </Button>
              <div className="rounded-full h-14 w-14 flex items-center justify-center">
                <FavoriteButton productId={product.id} size="lg" />
              </div>
              <Button size="lg" variant="ghost" className="rounded-full h-14 w-14">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
