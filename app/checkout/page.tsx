"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Truck, CreditCard, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

type CheckoutStep = "cart" | "shipping" | "review";

const getShippingMethods = (t: (key: string) => string) => [
  { id: "standard", name: t("checkout.standardShipping"), cost: 0, days: 5 },
  { id: "express", name: t("checkout.expressShipping"), cost: 15, days: 2 },
  { id: "overnight", name: t("checkout.overnight"), cost: 35, days: 1 },
];



export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const { t } = useLanguage();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("standard");

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        router.push("/auth");
        return;
      }

      try {
        const data = await api.cart.get();
        if (!data || data.length === 0) {
          router.push("/cart");
          return;
        }
        setCartItems(data);
      } catch (error: any) {
        toast({
          title: t("checkout.error"),
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user, router, t]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingMethods = getShippingMethods(t);
  const shippingCost = shippingMethods.find((m) => m.id === selectedShipping)?.cost || 0;
  const total = subtotal + shippingCost;

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    };

    let hasErrors = false;

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("checkout.fullNameRequired");
      hasErrors = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = t("checkout.emailRequired");
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("checkout.emailInvalid");
      hasErrors = true;
    }

    if (!formData.address.trim()) {
      newErrors.address = t("checkout.addressRequired");
      hasErrors = true;
    }

    if (!formData.city.trim()) {
      newErrors.city = t("checkout.cityRequired");
      hasErrors = true;
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = t("checkout.postalCodeRequired");
      hasErrors = true;
    }

    if (!formData.country.trim()) {
      newErrors.country = t("checkout.countryRequired");
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleNext = () => {
    if (step === "cart") {
      if (!validateForm()) {
        return;
      }
      setStep("shipping");
    } else if (step === "shipping") {
      setStep("review");
    }
  };

  const handleBack = () => {
    if (step === "review") {
      setStep("shipping");
    } else if (step === "shipping") {
      setStep("cart");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const shippingMethod = shippingMethods.find((m) => m.id === selectedShipping);

      await api.orders.create({
        shippingAddress: formData,
        shippingMethod: shippingMethod
          ? {
              type: shippingMethod.name,
              cost: shippingMethod.cost,
              estimatedDays: shippingMethod.days,
            }
          : undefined,
      });

      toast({
        title: t("checkout.orderPlaced"),
        description: t("checkout.thankYou"),
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: t("checkout.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="px-8 sm:px-12 lg:px-16">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="px-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            {t("checkout.title")}
          </h1>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl">
              {[
                { id: "cart", label: t("checkout.cart"), icon: Package },
                { id: "shipping", label: t("checkout.shipping"), icon: Truck },
                { id: "review", label: t("checkout.review"), icon: CheckCircle2 },
              ].map((s, index) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isCompleted =
                  ["cart", "shipping", "review"].indexOf(step) >
                  ["cart", "shipping", "review"].indexOf(s.id);

                return (
                  <div key={s.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isActive || isCompleted
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-background border-border text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 ${
                          isActive ? "font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${
                          isCompleted ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping Information */}
              {(step === "cart" || step === "shipping") && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("checkout.shippingInformation")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">{t("checkout.fullName")} *</Label>
                        <Input
                          id="fullName"
                          required
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className={errors.fullName ? "border-red-500" : ""}
                        />
                        {errors.fullName && (
                          <p className="text-sm text-red-500">{errors.fullName}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("checkout.email")} *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t("checkout.address")} *</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-500">{errors.address}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">{t("checkout.city")} *</Label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-500">{errors.city}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">{t("checkout.postalCode")} *</Label>
                        <Input
                          id="postalCode"
                          required
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                          className={errors.postalCode ? "border-red-500" : ""}
                        />
                        {errors.postalCode && (
                          <p className="text-sm text-red-500">{errors.postalCode}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">{t("checkout.country")} *</Label>
                      <Input
                        id="country"
                        required
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        className={errors.country ? "border-red-500" : ""}
                      />
                      {errors.country && (
                        <p className="text-sm text-red-500">{errors.country}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Shipping Method */}
              {step === "shipping" && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("checkout.shippingMethod")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={selectedShipping}
                      onValueChange={setSelectedShipping}
                      className="space-y-4"
                    >
                      {shippingMethods.map((method) => (
                        <div key={method.id}>
                          <RadioGroupItem
                            value={method.id}
                            id={method.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={method.id}
                            className="flex items-center justify-between p-4 rounded-lg border-2 border-border cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          >
                            <div className="flex items-center gap-4">
                              <Truck className="w-5 h-5" />
                              <div>
                                <div className="font-semibold">{method.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {method.days} {t("checkout.businessDays")}
                                </div>
                              </div>
                            </div>
                            <div className="font-semibold">
                              {method.cost === 0
                                ? t("cart.free")
                                : formatPrice(method.cost, currency)}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}



              {/* Step 4: Review */}
              {step === "review" && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("checkout.reviewOrder")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">{t("checkout.shippingAddress")}</h3>
                      <p className="text-muted-foreground">
                        {formData.fullName}
                        <br />
                        {formData.address}
                        <br />
                        {formData.city}, {formData.postalCode}
                        <br />
                        {formData.country}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t("checkout.shippingMethod")}</h3>
                      <p className="text-muted-foreground">
                        {
                          shippingMethods.find((m) => m.id === selectedShipping)
                            ?.name
                        }
                      </p>
                    </div>

                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {step !== "cart" && (
                  <Button variant="outline" onClick={handleBack}>
                    {t("checkout.back")}
                  </Button>
                )}
                {step !== "review" ? (
                  <Button onClick={handleNext} className="flex-1">
                    {t("checkout.continue")}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="flex-1"
                    disabled={submitting}
                  >
                    {submitting ? t("checkout.processing") : t("checkout.placeOrder")}
                  </Button>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{t("checkout.orderSummary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.product.images?.[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {t("checkout.qty")} {item.quantity}
                        </div>
                        <div className="font-semibold">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                      <span className="font-semibold">
                        {formatPrice(subtotal, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("cart.shipping")}</span>
                      <span className="font-semibold">
                        {shippingCost === 0
                          ? t("cart.free")
                          : formatPrice(shippingCost, currency)}
                      </span>
                    </div>
                    <div className="pt-2 border-t flex justify-between text-lg font-bold">
                      <span>{t("cart.total")}</span>
                      <span>{formatPrice(total, currency)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
