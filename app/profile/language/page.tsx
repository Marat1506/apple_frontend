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
import { useLanguage } from "@/contexts/LanguageContext";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
];

export default function LanguagePage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ru" | "ar">(language);

  const handleSave = () => {
    setLanguage(selectedLanguage);
    toast({
      title: "Language Updated",
      description: `Language changed to ${languages.find(l => l.code === selectedLanguage)?.name}`,
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
            <h1 className="text-2xl font-bold">Choose Language</h1>
          </div>

          {/* Language Selection */}
          <Card>
            <CardContent className="p-4">
              <RadioGroup
                value={selectedLanguage}
                onValueChange={(value) => setSelectedLanguage(value as "en" | "ru" | "ar")}
                className="space-y-3"
              >
                {languages.map((lang) => (
                  <div key={lang.code} className="flex items-center space-x-3">
                    <RadioGroupItem value={lang.code} id={lang.code} />
                    <Label
                      htmlFor={lang.code}
                      className="flex items-center gap-3 cursor-pointer flex-1 py-2"
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="flex-1">
                        <p className="font-medium">{lang.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lang.nativeName}
                        </p>
                      </div>
                      {selectedLanguage === lang.code && (
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
            disabled={selectedLanguage === language}
          >
            Save Changes
          </Button>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}