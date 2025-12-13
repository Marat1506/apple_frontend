"use client";

import { useState } from "react";
import { Menu, X, ShoppingBag, User, Search, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector, CurrencySelector } from "./LanguageSelector";

const Navigation = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { cartCount } = useCart();
  const { favorites } = useFavorites();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-[980px] mx-auto px-6">
        <div className="flex items-center justify-between h-11">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-[17px] font-semibold text-foreground">
              Dubliz
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Currency Selector */}
            <CurrencySelector />

            {/* Favorites */}
            {user && (
              <Link 
                href="/favorites" 
                className="text-muted-foreground hover:text-foreground transition-colors relative"
              >
                <Heart className="h-4 w-4" />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </Link>
            )}

            {/* Shopping Bag */}
            <Link 
              href="/cart" 
              className="text-muted-foreground hover:text-foreground transition-colors relative"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Search */}
            <button
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => router.push("/shop")}
              aria-label="Search products"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* User Profile */}
            {user ? (
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => router.push("/profile")}
              >
                <User className="h-4 w-4" />
              </button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/auth")}
                className="text-[12px] h-7 px-3 text-muted-foreground hover:text-foreground"
              >
                <User className="h-4 w-4 mr-1" />
                {t("nav.signIn")}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.store")}
            </Link>
            {user && (
              <Link
                href="/favorites"
                className="block px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("favorites.title")} {favorites.length > 0 && `(${favorites.length})`}
              </Link>
            )}
            <Link
              href="/cart"
              className="block px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.cart")} {cartCount > 0 && `(${cartCount})`}
            </Link>
            {user ? (
              <button
                onClick={() => {
                  router.push("/profile");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {t("nav.profile")}
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push("/auth");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {t("nav.signIn")}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;