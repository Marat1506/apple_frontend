"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/currency";

interface CartItem {
  id: string;
  quantity: number;
  selectedVariant?: any;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    variants?: any;
  };
}

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    try {
      const data = await api.cart.get();
      setCartItems(data);
      await refreshCart();
    } catch (error: any) {
      toast({
        title: t("toast.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user, t]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await api.cart.update(itemId, newQuantity);
      await fetchCart();
    } catch (error: any) {
      toast({
        title: t("toast.error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await api.cart.remove(itemId);
      toast({
        title: t("toast.removed"),
        description: t("toast.removedFromCart"),
      });
      await fetchCart();
    } catch (error: any) {
      toast({
        title: t("toast.error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="px-8 sm:px-12 lg:px-16">
            <Skeleton className="h-12 w-64 mb-8" />
            <Skeleton className="h-64" />
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />
      
      <main className="pt-20 pb-16 min-h-[calc(100vh-200px)]">
        <div className="px-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">{t("cart.title")}</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-8">{t("cart.empty")}</p>
              <Button onClick={() => router.push("/")}>{t("cart.continueShopping")}</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div 
                          className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0 cursor-pointer"
                          onClick={() => router.push(`/product/${item.product.slug}`)}
                        >
                          <img
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-full h-full object-contain p-2 hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 
                              className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer"
                              onClick={() => router.push(`/product/${item.product.slug}`)}
                            >
                              {item.product.name}
                            </h3>
                            {item.selectedVariant && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                {item.selectedVariant.color && (
                                  <span className="mr-3">{t("cart.color")}: {item.selectedVariant.color}</span>
                                )}
                                {item.selectedVariant.storage && (
                                  <span>{t("cart.storage")}: {item.selectedVariant.storage}</span>
                                )}
                              </div>
                            )}
                            <p className="text-xl font-bold text-foreground mt-2">
                              {formatPrice(item.product.price, currency)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("cart.subtotal")}: {formatPrice(item.product.price * item.quantity, currency)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 border border-border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("cart.remove")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">{t("cart.summary")}</h2>
                    <div className="space-y-2 py-4 border-y border-border/50">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                        <span className="font-semibold">{formatPrice(total, currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("cart.shipping")}</span>
                        <span className="font-semibold">{t("cart.free")}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>{t("cart.total")}</span>
                      <span>{formatPrice(total, currency)}</span>
                    </div>
                    <Button
                      className="w-full rounded-full"
                      size="lg"
                      onClick={() => router.push("/checkout")}
                    >
                      {t("cart.checkout")}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

