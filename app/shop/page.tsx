"use client";

import { useEffect, useState, Suspense } from "react";
import { api } from "@/lib/api";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ShopProductCard from "@/components/ShopProductCard";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams } from "next/navigation";

function ShopContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.products.getAll(language),
        api.categories.getAll(language),
      ]);
      setProducts(Array.isArray(productsRes) ? productsRes : []);
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      
      // Set category from URL parameter
      const categorySlug = searchParams.get('category');
      if (categorySlug && Array.isArray(categoriesRes)) {
        const category = categoriesRes.find(cat => cat.slug === categorySlug);
        if (category) {
          setSelectedCategory(category.id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [language, searchParams]);

  const filteredProducts = products
    .filter((product) => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Category filter
      if (selectedCategory && product.categoryId !== selectedCategory) return false;
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return b.featured ? 1 : -1;
      }
    });

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, 5000]);
    setSortBy("featured");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold animate-pulse">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="px-8 sm:px-12 lg:px-16">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {selectedCategory ? 
                categories.find(cat => cat.id === selectedCategory)?.name || t("shop.title") : 
                t("shop.title")
              }
            </h1>
            <p className="text-muted-foreground mb-6">
              {selectedCategory ? 
                categories.find(cat => cat.id === selectedCategory)?.description || t("shop.subtitle") :
                t("shop.subtitle")
              }
            </p>

            {/* Show all products button when category is selected */}
            {selectedCategory && (
              <div className="mb-4">
                <button
                  onClick={() => setSelectedCategory("")}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  ← {t("shop.allProducts")}
                </button>
              </div>
            )}
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder={t("shop.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted rounded-lg mb-4"
              >
                <Filter className="w-5 h-5" />
                {t("shop.filters")}
              </button>

              <div
                className={`${
                  showFilters ? "block" : "hidden"
                } lg:block space-y-6 bg-card p-6 rounded-lg shadow-sm border border-border`}
              >
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{t("shop.filters")}</h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      {t("shop.clearAll")}
                    </button>
                </div>

                {/* Category Filter */}
                <div>
                  <h4 className="font-medium mb-3 text-foreground">{t("shop.category")}</h4>
                  <div className="space-y-2">
                    <label className="flex items-center text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === ""}
                        onChange={() => setSelectedCategory("")}
                        className="mr-2 accent-primary"
                      />
                      {t("shop.allProducts")}
                    </label>
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center text-foreground cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className="mr-2 accent-primary"
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3 text-foreground">{t("shop.priceRange")}</h4>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], parseInt(e.target.value)])
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="font-medium mb-3 text-foreground">{t("shop.sortBy")}</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="featured">{t("shop.sortFeatured")}</option>
                    <option value="price-asc">{t("shop.sortPriceAsc")}</option>
                    <option value="price-desc">{t("shop.sortPriceDesc")}</option>
                    <option value="name">{t("shop.sortName")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-muted-foreground">
                {t("shop.showing")} {filteredProducts.length} {t("shop.of")} {products.length} {t("shop.products")}
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ShopProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground">{t("shop.noProducts")}</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-primary hover:text-primary/80"
                  >
                    {t("shop.clearFilters")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
