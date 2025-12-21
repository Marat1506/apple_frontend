"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const footerSections = [{
    title: t("footer.shop"),
    links: ["Store", "Mac", "iPad", "iPhone", "Watch", "AirPods", "Accessories"]
  }, {
    title: t("footer.services"),
    links: ["Apex Music", "Apex TV+", "Apex Fitness+", "Apex Cloud", "Apex One"]
  }, {
    title: t("footer.account"),
    links: ["Manage Your ID", "Apex Store Account", "iCloud.com"]
  }, {
    title: t("footer.store"),
    links: ["Find a Store", "Genius Bar", "Today at Apex", "Group Reservations"]
  }, {
    title: t("footer.about"),
    links: ["Newsroom", "Leadership", "Career", "Investors", "Ethics & Compliance"]
  }];
  return <footer className="bg-muted/50 border-t border-border/50 pt-12 pb-8">
      <div className="px-8 sm:px-12 lg:px-16">
        {/* Footer Links */}
        

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              <span>{t("footer.copyright")}</span>
              <a href="#" className="hover:text-foreground transition-colors">{t("footer.privacyPolicy")}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t("footer.termsOfUse")}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t("footer.salesPolicy")}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t("footer.legal")}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t("footer.siteMap")}</a>
            </div>
            <div className="text-sm text-muted-foreground">{t("footer.location")}</div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;