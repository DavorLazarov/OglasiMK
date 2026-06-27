"use client"

import Link from "next/link"
import { Car, Home, Smartphone, Briefcase, Wrench, Sofa } from "lucide-react"
import { useLanguage } from "./language-provider"
import { LOCATIONS } from "@/lib/types"

export function Footer() {
  const { t } = useLanguage()

  // Helper to get the translated category name if needed,
  // though we'll use the icons and keys for clarity.
  const categories = [
    { name: t("vehicles"), icon: Car, href: "/vozila" },
    { name: t("realEstate"), icon: Home, href: "/nedviznini" },
    { name: t("electronics"), icon: Smartphone, href: "/elektronika" },
    { name: t("jobs"), icon: Briefcase, href: "/rabota" },
    { name: t("services"), icon: Wrench, href: "/uslugi" },
    { name: t("furniture"), icon: Sofa, href: "/mebel" },
  ]

  // We use the first 5 locations for the footer to keep it clean
  const footerLocations = LOCATIONS.slice(0, 5)

  return (
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="font-bold text-primary-foreground">О</span>
                </div>
                <span className="text-lg font-bold">{t("siteName")}</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t("heroSubtitle")}</p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">{t("categories")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {categories.map((cat) => (
                    <li key={cat.href}>
                      <Link href={cat.href} className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <cat.icon className="h-4 w-4" />
                        {cat.name}
                      </Link>
                    </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">{t("location")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {footerLocations.map((city) => (
                    <li key={city}>
                      <Link
                          href={`/prebaruvanje?lokacija=${city}`}
                          className="hover:text-foreground transition-colors"
                      >
                        {city}
                      </Link>
                    </li>
                ))}
                <li>
                  <Link href="/prebaruvanje" className="text-primary hover:underline font-medium">
                    {t("allLocations")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">{t("contact")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>info@oglasimk.mk</li>
                <li>+389 2 XXX XXX</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2026 {t("siteName")}. {t("allRightsReserved")}.
            </p>
          </div>
        </div>
      </footer>
  )
}