"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ArrowLeft, Check } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Currency } from "@/lib/currency";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
];

export default function CurrencyPage() {
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  const handleSave = () => {
    setCurrency(selectedCurrency as Currency);
    toast({
      title: "Currency Updated",
      description: `Currency changed to ${currencies.find(c => c.code === selectedCurrency)?.name}`,
    });
    router.back();
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="px-8 sm:px-12 lg:px-16">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Currency</h1>
          </div>

          {/* Currency Selection */}
          <Card>
            <CardContent className="p-4">
              <RadioGroup
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
                className="space-y-3"
              >
                {currencies.map((currency) => (
                  <div key={currency.code} className="flex items-center space-x-3">
                    <RadioGroupItem value={currency.code} id={currency.code} />
                    <Label
                      htmlFor={currency.code}
                      className="flex items-center gap-3 cursor-pointer flex-1 py-2"
                    >
                      <span className="text-2xl">{currency.flag}</span>
                      <div className="flex-1">
                        <p className="font-medium">{currency.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {currency.code} • {currency.symbol}
                        </p>
                      </div>
                      {selectedCurrency === currency.code && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full mt-6"
            disabled={selectedCurrency === currency}
          >
            Save Changes
          </Button>

          {/* Note */}
          <p className="text-sm text-muted-foreground text-center mt-4">
            Prices will be displayed in your selected currency. 
            Actual charges may vary based on current exchange rates.
          </p>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}