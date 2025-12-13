"use client";

import { Cpu, Zap, Shield, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Cpu,
      title: t("features.m3.title"),
      description: t("features.m3.description"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: t("features.battery.title"),
      description: t("features.battery.description"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: t("features.security.title"),
      description: t("features.security.description"),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Smartphone,
      title: t("features.ecosystem.title"),
      description: t("features.ecosystem.description"),
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            {t("features.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;