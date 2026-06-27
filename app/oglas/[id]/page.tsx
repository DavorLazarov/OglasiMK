"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAds } from "@/components/ads-provider"
import { useLanguage } from "@/components/language-provider"
import {
  MapPin,
  Calendar as CalendarIcon,
  User,
  Phone,
  Mail,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react"

export default function AdDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { ads, toggleFavorite, isFavorite } = useAds()
  const { t, language } = useLanguage()
  const id = params?.id as string

  const rawAd = ads.find((a) => Number(a.id) === Number(id))

  const ad = rawAd ? {
    ...rawAd,
    ...(typeof rawAd.details === 'string'
        ? JSON.parse(rawAd.details)
        : rawAd.details || {})
  } : null

  if (!ad) {
    return (
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold">{t("adNotFound")}</h1>
              <p className="mt-4 text-muted-foreground">
                {language === "mk" ? "Огласот не постои." : "Ad not found."}
              </p>
              <Link href="/">
                <Button className="mt-8">{t("backToHome")}</Button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
    )
  }

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €"
  }

  // ПОПРАВКА ЗА ДАТУМОТ (Invalid Date)
  const formatDate = (dateString: any) => {
    if (!dateString) return t("unknownDate") || "---"
    const date = new Date(dateString)

    // Ако датумот е невалиден, врати го оригиналниот стринг или денешен датум
    if (isNaN(date.getTime())) {
      return language === "mk" ? "Неодамна" : "Recently"
    }

    return date.toLocaleDateString(language === "mk" ? "mk-MK" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // ПОПРАВКА ЗА ИМЕ НА ПРОДАВАЧ
  // Ги проверуваме сите можни локации каде Prisma го чува името
  const sellerName = ad.userName || ad.user?.name || ad.author?.name || (language === "mk" ? "Приватен корисник" : "Private User")

  const handleCall = () => ad.phone && (window.location.href = `tel:${ad.phone}`)
  const handleEmail = () => ad.email && (window.location.href = `mailto:${ad.email}`)

  return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <Link href="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToHome")}
            </Link>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-muted border">
                  <Image src={ad.image || "/placeholder.svg"} alt={ad.title} fill className="object-cover" priority />
                </div>

                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-4">{ad.title}</h1>
                    <h2 className="mb-4 text-lg font-semibold border-b pb-2">{language === "mk" ? "Детали" : "Details"}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {ad.category === "vehicles" && (
                          <>
                            {ad.brand && <DetailRow label={t("brand")} value={ad.brand} />}
                            {ad.model && <DetailRow label={t("model")} value={ad.model} />}
                            {ad.year && <DetailRow label={t("year")} value={ad.year} />}
                            {ad.fuelType && <DetailRow label={t("fuel")} value={ad.fuelType} />}
                          </>
                      )}
                      {ad.category === "real-estate" && (
                          <>
                            {ad.area && <DetailRow label={t("area")} value={`${ad.area} м²`} />}
                            {ad.rooms && <DetailRow label={t("roomsCount")} value={ad.rooms} />}
                          </>
                      )}
                    </div>
                    <div className="mt-6">
                      <h3 className="mb-2 font-semibold">{t("description")}</h3>
                      <p className="whitespace-pre-wrap text-muted-foreground">{ad.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-3xl font-bold text-primary">{formatPrice(ad.price)}</p>
                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {ad.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" /> {formatDate(ad.createdAt)}
                      </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                      <Button variant="outline" className="flex-1 gap-2" onClick={() => toggleFavorite(ad.id)}>
                        <Heart className={`h-4 w-4 ${isFavorite(ad.id) ? "fill-red-500 text-red-500" : ""}`} />
                        {t("favorites")}
                      </Button>
                      <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-lg leading-none">{sellerName}</p>
                        <p className="text-sm text-muted-foreground mt-1">{t("seller")}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {ad.phone && (
                          <Button className="w-full py-6 text-lg" onClick={handleCall}>
                            <Phone className="mr-2 h-5 w-5" /> {ad.phone}
                          </Button>
                      )}
                      {ad.email && (
                          <Button variant="outline" className="w-full" onClick={handleEmail}>
                            <Mail className="mr-2 h-4 w-4" /> {ad.email}
                          </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
      <div className="flex justify-between border-b border-border pb-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
  )
}