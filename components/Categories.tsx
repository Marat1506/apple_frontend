"use client";

import { Laptop, Smartphone, Tablet, Watch, Glasses, Headphones, Locate, Tv, Speaker, Package, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

const Categories = () => {
  const { t } = useLanguage();
  const router = useRouter();

  const categories = [
    { name: t("categories.mac"), icon: Laptop, slug: "mac" },
    { name: t("categories.iphone"), icon: Smartphone, slug: "iphone" },
    { name: t("categories.ipad"), icon: Tablet, slug: "ipad" },
    { name: t("categories.watch"), icon: Watch, slug: "apple-watch" },
    { name: t("categories.visionPro"), icon: Glasses, slug: "apple-vision-pro" },
    { name: t("categories.airpods"), icon: Headphones, slug: "airpods" },
    { name: t("categories.airtag"), icon: Locate, slug: "airtag" },
    { name: t("categories.appleTV"), icon: Tv, slug: "apple-tv-4k" },
    { name: t("categories.homepod"), icon: Speaker, slug: "homepod" },
    { name: t("categories.accessories"), icon: Package, slug: "accessories" },
  ];

  return (
    <section className="py-12 bg-background border-y border-border">
      <div className="px-8 sm:px-12 lg:px-16">
        {/* Horizontal scrollable on mobile, grid on desktop */}
        <div className="overflow-x-auto -mx-8 sm:-mx-12 lg:-mx-16 md:mx-0 px-8 sm:px-12 lg:px-16 md:px-0">
          <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4 min-w-max sm:min-w-0">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.slug}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card hover:bg-muted transition-all duration-300 group hover-lift cursor-pointer animate-fade-in-up flex-shrink-0 w-[100px] sm:w-auto"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => {
                    // Navigate to shop page with category filter
                    router.push(`/shop?category=${category.slug}`);
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-center text-foreground leading-tight">
                    {category.name}
                  </span>
                </button>
              );
            })}
            {/* Arrow indicator on mobile */}
            <div className="sm:hidden flex items-center text-muted-foreground flex-shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
