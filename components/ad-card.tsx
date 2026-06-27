"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Ad } from "@/lib/types"
import { MapPin, Calendar, Fuel, Gauge, Maximize, DoorOpen, Clock, Heart, Briefcase, Wrench, Sofa } from "lucide-react"
import { useLanguage } from "./language-provider"
import { useAds } from "./ads-provider"

interface AdCardProps {
  ad: Ad
  showFavorite?: boolean
}

export function AdCard({ ad, showFavorite = true }: AdCardProps) {
  const { language, t } = useLanguage()
  const { toggleFavorite, isFavorite } = useAds()
  const favorite = isFavorite(ad.id)

  const formatPrice = (price: number) => {
    if (price === 0) return language === "mk" ? "По договор" : "Negotiable"
    // Use a custom formatter to avoid hydration mismatch
    const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return formatted + " €"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "mk" ? "mk-MK" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (language === "mk") {
      if (diffDays === 0) return "Денес"
      if (diffDays === 1) return "Вчера"
      if (diffDays < 7) return `Пред ${diffDays} дена`
      if (diffDays < 30) return `Пред ${Math.floor(diffDays / 7)} недели`
      return formatDate(dateString)
    } else {
      if (diffDays === 0) return "Today"
      if (diffDays === 1) return "Yesterday"
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      return formatDate(dateString)
    }
  }

  const getCategoryLabel = () => {
    switch (ad.category) {
      case "vehicles":
        return t("vehicle")
      case "real-estate":
        return t("property")
      case "electronics":
        return t("electronic")
      case "jobs":
        return t("job")
      case "services":
        return t("service")
      case "furniture":
        return t("furnitureItem")
      default:
        return ad.category
    }
  }

  const getBadgeVariant = () => {
    switch (ad.category) {
      case "vehicles":
        return "default"
      case "real-estate":
        return "secondary"
      case "electronics":
        return "outline"
      case "jobs":
        return "default"
      case "services":
        return "secondary"
      case "furniture":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/oglas/${ad.id}`}>
          <Image
            src={ad.image || "/placeholder.svg"}
            alt={ad.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <Badge className="absolute left-3 top-3" variant={getBadgeVariant()}>
          {getCategoryLabel()}
        </Badge>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
          <Clock className="h-3 w-3" />
          {getRelativeTime(ad.createdAt)}
        </div>
        {showFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite(ad.id)
            }}
            title={favorite ? t("removeFromFavorites") : t("addToFavorites")}
          >
            <Heart className={`h-4 w-4 ${favorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        )}
      </div>
      <Link href={`/oglas/${ad.id}`}>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-semibold leading-tight group-hover:text-primary">{ad.title}</h3>
          </div>

          <p className="mb-3 text-xl font-bold text-primary">{formatPrice(ad.price)}</p>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {ad.category === "vehicles" && (
              <>
                {ad.year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {ad.year}
                  </span>
                )}
                {ad.mileage && (
                  <span className="flex items-center gap-1">
                    <Gauge className="h-3 w-3" />
                    {ad.mileage.toLocaleString("mk-MK")} км
                  </span>
                )}
                {ad.fuelType && (
                  <span className="flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    {ad.fuelType}
                  </span>
                )}
              </>
            )}
            {ad.category === "real-estate" && (
              <>
                {ad.area && (
                  <span className="flex items-center gap-1">
                    <Maximize className="h-3 w-3" />
                    {ad.area} м²
                  </span>
                )}
                {ad.rooms && (
                  <span className="flex items-center gap-1">
                    <DoorOpen className="h-3 w-3" />
                    {ad.rooms} {t("rooms")}
                  </span>
                )}
              </>
            )}
            {ad.category === "electronics" && ad.condition && (
              <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5">{ad.condition}</span>
            )}
            {ad.category === "jobs" && (
              <>
                {ad.jobType && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {ad.jobType}
                  </span>
                )}
                {ad.salary && <span className="font-medium text-green-600">{ad.salary}</span>}
              </>
            )}
            {ad.category === "services" && ad.serviceType && (
              <span className="flex items-center gap-1">
                <Wrench className="h-3 w-3" />
                {ad.serviceType}
              </span>
            )}
            {ad.category === "furniture" && ad.furnitureType && (
              <span className="flex items-center gap-1">
                <Sofa className="h-3 w-3" />
                {ad.furnitureType}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {ad.location}
            </span>
            <span className="text-muted-foreground/70">{formatDate(ad.createdAt)}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
