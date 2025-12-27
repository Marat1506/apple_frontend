"use client";

import { Home, ShoppingBag, User, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { icon: Home, label: t("nav.home") || "Home", path: "/" },
    { icon: ShoppingBag, label: t("nav.cart") || "Bag", path: "/cart" },
    { icon: User, label: t("nav.profile") || "Account", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.count && item.count > 0 && (
                <span className="absolute top-2 right-1/2 translate-x-2 bg-red-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                  {item.count > 9 ? '9+' : item.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;


