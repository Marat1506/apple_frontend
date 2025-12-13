"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({ productId, className, size = "md" }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();

  if (!user) {
    return null; // Don't show favorite button for non-authenticated users
  }

  const isInFavorites = isFavorite(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  const sizeClasses = {
    sm: "w-6 h-6 p-1",
    md: "w-8 h-8 p-1.5",
    lg: "w-10 h-10 p-2",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all duration-200 hover:scale-110",
        sizeClasses[size],
        className
      )}
      aria-label={isInFavorites ? t("favorites.removeFromFavorites") : t("favorites.addToFavorites")}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-colors",
          isInFavorites
            ? "text-red-500 fill-red-500"
            : "text-gray-600 hover:text-red-500"
        )}
      />
    </button>
  );
}