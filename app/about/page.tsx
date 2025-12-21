"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ArrowLeft, Mail, Phone, MapPin, Users, Award, Shield } from "lucide-react";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface AboutUsSection {
  id: string;
  key: string;
  translations: {
    en?: Record<string, any>;
    ru?: Record<string, any>;
    ar?: Record<string, any>;
  };
}

export default function AboutPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [sections, setSections] = useState<AboutUsSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutUs();
  }, [language]);

  const fetchAboutUs = async () => {
    try {
      setLoading(true);
      const data = await api.settings.aboutUs.getAll(language);
      setSections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch About Us:", error);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const getSection = (key: string) => {
    return sections.find(s => s.key === key);
  };

  const getTranslation = (section: AboutUsSection | undefined, field: string): string => {
    if (!section) return '';
    const translation = section.translations[language as 'en' | 'ru' | 'ar'];
    if (translation && translation[field]) {
      return translation[field];
    }
    // Fallback to English
    const enTranslation = section.translations.en;
    return enTranslation?.[field] || '';
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
            <div>
              <h1 className="text-2xl font-bold">About Us</h1>
              <p className="text-muted-foreground">
                {getTranslation(getSection('main'), 'subtitle') || 'Learn more about us'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <>
              {/* Main Section */}
              {getSection('main') && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h2 className="text-3xl font-bold mb-2">
                        {getTranslation(getSection('main'), 'title')}
                      </h2>
                      {getTranslation(getSection('main'), 'subtitle') && (
                        <p className="text-lg text-muted-foreground">
                          {getTranslation(getSection('main'), 'subtitle')}
                        </p>
                      )}
                    </div>
                    
                    {getTranslation(getSection('main'), 'description') && (
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {getTranslation(getSection('main'), 'description')}
                      </p>
                    )}
                    
                    {getTranslation(getSection('main'), 'content') && (
                      <p className="text-muted-foreground leading-relaxed">
                        {getTranslation(getSection('main'), 'content')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Features Section */}
              {getSection('features') && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">
                      {getTranslation(getSection('features'), 'title') || 'Features'}
                    </h3>
                    {getTranslation(getSection('features'), 'content') && (
                      <div className="text-muted-foreground leading-relaxed">
                        {getTranslation(getSection('features'), 'content')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Services Section */}
              {getSection('services') && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">
                      {getTranslation(getSection('services'), 'title') || 'Our Services'}
                    </h3>
                    {getTranslation(getSection('services'), 'content') && (
                      <div className="text-muted-foreground leading-relaxed">
                        {getTranslation(getSection('services'), 'content')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Contact Section */}
              {getSection('contact') && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">
                      {getTranslation(getSection('contact'), 'title') || 'Contact Us'}
                    </h3>
                    {getTranslation(getSection('contact'), 'content') && (
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {getTranslation(getSection('contact'), 'content')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}