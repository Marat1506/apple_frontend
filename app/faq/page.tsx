"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQItem {
  id: string;
  category: string;
  order: number;
  translations: {
    en?: { question: string; answer: string; category: string };
    ru?: { question: string; answer: string; category: string };
    ar?: { question: string; answer: string; category: string };
  };
}

export default function FAQPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetchFAQs();
    // Сохраняем открытые элементы и выбранную категорию при смене языка
    // Не сбрасываем состояние фильтров
  }, [language]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await api.settings.faq.getAll(language);
      setFaqs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const getTranslatedFAQ = (faq: FAQItem) => {
    const translation = faq.translations[language as 'en' | 'ru' | 'ar'];
    if (translation) {
      return {
        question: translation.question,
        answer: translation.answer,
        category: translation.category || faq.category,
      };
    }
    // Fallback to English
    const enTranslation = faq.translations.en;
    return {
      question: enTranslation?.question || '',
      answer: enTranslation?.answer || '',
      category: enTranslation?.category || faq.category,
    };
  };

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(faqs.map(item => getTranslatedFAQ(item).category)))];
  }, [faqs, language]);

  // Проверяем, существует ли выбранная категория после смены языка
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(selectedCategory)) {
      // Если выбранная категория больше не существует, сбрасываем на "All"
      setSelectedCategory("All");
    }
  }, [categories, selectedCategory]);

  const filteredFAQ = selectedCategory === "All" 
    ? faqs 
    : faqs.filter(item => getTranslatedFAQ(item).category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
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
              <h1 className="text-2xl font-bold">FAQ</h1>
              <p className="text-muted-foreground">Frequently Asked Questions</p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* FAQ Items */}
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <div className="space-y-4">
              {filteredFAQ.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No FAQs found</div>
              ) : (
                filteredFAQ.map((item) => {
                  const translated = getTranslatedFAQ(item);
                  return (
                    <Card key={item.id}>
                      <Collapsible
                        open={openItems.includes(item.id)}
                        onOpenChange={() => toggleItem(item.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="text-left">
                                <p className="font-medium">{translated.question}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {translated.category}
                                </p>
                              </div>
                              {openItems.includes(item.id) ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </CardContent>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0 px-4 pb-4">
                            <div className="border-t pt-4">
                              <p className="text-muted-foreground leading-relaxed">
                                {translated.answer}
                              </p>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  );
                })
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}