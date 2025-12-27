"use client";

import { useState, useRef, useEffect } from "react";
import { ShoppingBag, User, Search, Heart, Grid3X3, Globe, DollarSign, HelpCircle, Info, ShoppingBag as CartIcon } from "lucide-react";
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowProfileMenu(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowProfileMenu(false);
    }, 150); // 150ms delay before closing
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [showProfileMenu]);

  const menuItems = [
    {
      id: "favorites",
      icon: <Heart className="h-5 w-5" />,
      label: t("profile.menu.favourites"),
      href: "/favorites",
      requiresAuth: true,
    },
    {
      id: "cart",
      icon: <CartIcon className="h-5 w-5" />,
      label: t("profile.menu.cart"),
      href: "/cart",
      requiresAuth: true,
    },
    {
      id: "categories",
      icon: <Grid3X3 className="h-5 w-5" />,
      label: t("profile.menu.allCategory"),
      href: "/shop",
      requiresAuth: false,
    },
    {
      id: "language",
      icon: <Globe className="h-5 w-5" />,
      label: t("profile.menu.chooseLanguage"),
      href: "/profile/language",
      requiresAuth: false,
    },
    {
      id: "currency",
      icon: <DollarSign className="h-5 w-5" />,
      label: t("profile.menu.currency"),
      href: "/profile/currency",
      requiresAuth: false,
    },
    {
      id: "faq",
      icon: <HelpCircle className="h-5 w-5" />,
      label: t("profile.menu.faq"),
      href: "/faq",
      requiresAuth: false,
    },
    {
      id: "about",
      icon: <Info className="h-5 w-5" />,
      label: t("profile.menu.aboutUs"),
      href: "/about",
      requiresAuth: false,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="px-8 sm:px-12 lg:px-16">
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

            {/* User Profile Dropdown */}
            <div 
              ref={profileMenuRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => router.push("/profile")}
              >
                <User className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    {/* App Name */}
                    <div className="text-center mb-4">
                      <span className="text-lg font-semibold text-foreground">Dubliz</span>
                    </div>

                    {/* Login/Register Buttons */}
                    {!user && (
                      <div className="flex gap-2 mb-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            router.push("/auth");
                            setShowProfileMenu(false);
                          }}
                        >
                          {t("nav.signIn")}
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={() => {
                            router.push("/auth");
                            setShowProfileMenu(false);
                          }}
                        >
                          {t("nav.signUp")}
                        </Button>
                      </div>
                    )}

                    {/* Menu Items */}
                    <div className="space-y-1">
                      {menuItems.map((item) => {
                        // Skip items that require auth if user is not logged in
                        if (item.requiresAuth && !user) {
                          return null;
                        }

                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-foreground"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            {Icon}
                            <span className="text-sm">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Language & Currency Selectors */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Currency Selector */}
            <CurrencySelector />
          </div>

        </div>
      </div>

    </nav>
  );
};

export default Navigation;