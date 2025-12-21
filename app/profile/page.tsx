"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Heart, 
  FileText, 
  CreditCard, 
  Grid3X3, 
  Globe, 
  DollarSign, 
  HelpCircle, 
  Info, 
  Sun,
  Moon,
  ChevronRight,
  LogIn,
  User,
  ShoppingBag
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

interface ProfileMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  requiresAuth: boolean;
  action?: () => void;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoading(false);
    // Инициализируем тему если её нет
    if (!theme) {
      setTheme("light");
    }
  }, [theme, setTheme]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/auth");
  };

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  const menuItems: ProfileMenuItem[] = [
    {
      id: "favorites",
      icon: <Heart className="h-5 w-5" />,
      label: t("profile.menu.favourites"),
      href: "/favorites",
      requiresAuth: true,
    },
    {
      id: "cart",
      icon: <ShoppingBag className="h-5 w-5" />,
      label: t("profile.menu.cart"),
      href: "/cart",
      requiresAuth: false,
    },
    // {
    //   id: "invoice",
    //   icon: <FileText className="h-5 w-5" />,
    //   label: t("profile.menu.invoice"),
    //   href: "/profile/invoice",
    //   requiresAuth: true,
    // },
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

  const handleMenuClick = (item: ProfileMenuItem) => {
    // Для разделов, не требующих авторизации, переходим сразу
    if (!item.requiresAuth) {
      if (item.action) {
        item.action();
      } else if (item.href) {
        router.push(item.href);
      }
      return;
    }

    // Для разделов, требующих авторизации, проверяем пользователя
    if (item.requiresAuth && !user) {
      router.push("/auth");
      return;
    }

    // Пользователь авторизован, выполняем действие
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="px-8 sm:px-12 lg:px-16">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
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
        <div className="px-8 sm:px-12 lg:px-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">{t("profile.pageTitle")}</h1>
            
            {!user ? (
              <Button 
                onClick={handleLogin}
                className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
              >
                {t("profile.login")}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="text-sm">{user.fullName}</span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item) => {
              // Разделы, не требующие авторизации, всегда доступны
              // Разделы, требующие авторизации, доступны только авторизованным пользователям
              const isAccessible = !item.requiresAuth || user;
              
              return (
                <Card 
                  key={item.id} 
                  className="border-0 shadow-none bg-transparent hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleMenuClick(item)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`${!isAccessible ? 'opacity-50' : ''}`}>
                        {item.icon}
                      </div>
                      <span className={`font-medium ${!isAccessible ? 'opacity-50' : ''}`}>
                        {item.label}
                      </span>
                      {!isAccessible && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {t("profile.loginRequired")}
                        </span>
                      )}
                    </div>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground ${!isAccessible ? 'opacity-50' : ''}`} />
                  </CardContent>
                </Card>
              );
            })}

            {/* Theme Toggle */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {theme === "light" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                  <span className="font-medium">
                    {theme === "light" ? "Light theme" : "Dark theme"}
                  </span>
                </div>
                <Switch
                  checked={theme === "light"}
                  onCheckedChange={toggleTheme}
                />
              </CardContent>
            </Card>

            {/* Sign Out Button (only if logged in) */}
            {user && (
              <Card 
                className="border-0 shadow-none bg-transparent hover:bg-red-50 transition-colors cursor-pointer mt-8"
                onClick={handleSignOut}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <LogIn className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-600">Sign Out</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-red-600" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
