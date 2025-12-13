"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface Variant {
  colors?: Array<{ id: string; name: string; hex: string }>;
  storage?: string[];
  versions?: string[];
}

interface ProductConfiguratorProps {
  variants: Variant;
  onVariantChange?: (variant: {
    color?: string;
    storage?: string;
    version?: string;
  }) => void;
}

const defaultColors = [
  { id: "space-gray", name: "Space Gray", hex: "#535355" },
  { id: "silver", name: "Silver", hex: "#E3E4E5" },
  { id: "gold", name: "Gold", hex: "#FAD7BD" },
  { id: "midnight", name: "Midnight", hex: "#2D2D2F" },
];

const defaultStorage = ["128GB", "256GB", "512GB", "1TB"];

export default function ProductConfigurator({
  variants,
  onVariantChange,
}: ProductConfiguratorProps) {
  const { t } = useLanguage();
  const rawColors = (variants as any).colors;

  const colors =
    (Array.isArray(rawColors) && rawColors.length > 0
      ? typeof rawColors[0] === "string"
        ? (rawColors as string[]).map((name, index) => {
            const base = defaultColors[index % defaultColors.length];
            return {
              id: name.toLowerCase().replace(/\s+/g, "-"),
              name,
              hex: base.hex,
            };
          })
        : (rawColors as Array<{ id: string; name: string; hex: string }>)
      : defaultColors);

  const storage = variants.storage && variants.storage.length > 0 ? variants.storage : defaultStorage;
  const versions = variants.versions || [];

  const [selectedColor, setSelectedColor] = useState(colors[0]?.id || "");
  const [selectedStorage, setSelectedStorage] = useState(storage[0] || "");
  const [selectedVersion, setSelectedVersion] = useState(versions[0] || "");

  const handleColorChange = (colorId: string) => {
    setSelectedColor(colorId);
    onVariantChange?.({
      color: colorId,
      storage: selectedStorage,
      version: selectedVersion,
    });
  };

  const handleStorageChange = (storageValue: string) => {
    setSelectedStorage(storageValue);
    onVariantChange?.({
      color: selectedColor,
      storage: storageValue,
      version: selectedVersion,
    });
  };

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    onVariantChange?.({
      color: selectedColor,
      storage: selectedStorage,
      version,
    });
  };

  return (
    <div className="space-y-8">
      {/* Color Selection */}
      {colors.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">
                {t("config.finish.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("config.finish.subtitle")}
              </p>
            </div>
            <RadioGroup
              value={selectedColor}
              onValueChange={handleColorChange}
              className="flex flex-wrap gap-6"
            >
              {colors.map((color) => (
                <div key={color.id} className="flex flex-col items-center">
                  <RadioGroupItem
                    value={color.id}
                    id={color.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={color.id}
                    className="flex flex-col items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className="w-14 h-14 rounded-full border-2 transition-all duration-200 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:ring-offset-4 group-hover:scale-110"
                      style={{
                        backgroundColor: color.hex,
                        borderColor:
                          selectedColor === color.id
                            ? "hsl(var(--primary))"
                            : "hsl(var(--border))",
                      }}
                    />
                    <span className="text-sm font-medium">{color.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Storage Selection */}
      {storage.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">
                {t("config.storage.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("config.storage.subtitle")}
              </p>
            </div>
            <RadioGroup
              value={selectedStorage}
              onValueChange={handleStorageChange}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {storage.map((storageOption) => (
                <div key={storageOption}>
                  <RadioGroupItem
                    value={storageOption}
                    id={storageOption}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={storageOption}
                    className="flex flex-col items-center justify-center px-6 py-8 rounded-2xl border-2 border-border bg-background cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:shadow-lg"
                  >
                    <span className="text-2xl font-bold mb-1">
                      {storageOption}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {storageOption === storage[0] ? t("config.storage.base") : ""}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Version Selection */}
      {versions.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">
                {t("config.version.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("config.version.subtitle")}
              </p>
            </div>
            <RadioGroup
              value={selectedVersion}
              onValueChange={handleVersionChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {versions.map((version) => (
                <div key={version}>
                  <RadioGroupItem
                    value={version}
                    id={version}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={version}
                    className="flex items-center justify-center px-6 py-4 rounded-xl border-2 border-border bg-background cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <span className="text-lg font-semibold">{version}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

