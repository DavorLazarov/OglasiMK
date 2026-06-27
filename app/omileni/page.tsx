"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdCard } from "@/components/ad-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAds } from "@/components/ads-provider"
import { useLanguage } from "@/components/language-provider"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function FavoritesPage() {
  const { ads, favorites } = useAds()
  const { t } = useLanguage()

  const favoriteAds = ads.filter((ad) => favorites.includes(ad.id))

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{t("favorites")}</h1>
          </div>

          {favoriteAds.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Heart className="mb-4 h-16 w-16 text-muted-foreground/30" />
                <p className="mb-4 text-lg text-muted-foreground">{t("noFavorites")}</p>
                <Link href="/">
                  <Button>{t("backToHome")}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
