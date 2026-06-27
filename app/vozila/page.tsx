"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdCard } from "@/components/ad-card"
import { ListingFilters } from "@/components/listing-filters"
import { useAds } from "@/components/ads-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, X } from "lucide-react"

export default function VehiclesPage() {
  const { ads } = useAds()
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  // 1. Initial State from URL
  const [filters, setFilters] = useState({
    location: searchParams.get("lokacija") || "all",
    query: searchParams.get("q") || "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    fuelType: "all",
  })

  // 2. Sync if SearchBar is used while on this page
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      location: searchParams.get("lokacija") || "all",
      query: searchParams.get("q") || ""
    }))
  }, [searchParams])

  const vehicleAds = useMemo(() => {
    return ads
        .filter((ad) => ad.category === "vehicles")
        .filter((ad) => {
          if (filters.location !== "all" && ad.location !== filters.location) return false
          if (filters.query && !ad.title.toLowerCase().includes(filters.query.toLowerCase())) return false
          if (filters.minPrice && ad.price < Number(filters.minPrice)) return false
          if (filters.maxPrice && ad.price > Number(filters.maxPrice)) return false
          if (filters.minYear && ad.year && ad.year < Number(filters.minYear)) return false
          if (filters.maxYear && ad.year && ad.year > Number(filters.maxYear)) return false
          if (filters.fuelType !== "all" && ad.fuelType !== filters.fuelType) return false
          return true
        })
  }, [ads, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      location: "all", query: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "", fuelType: "all",
    })
  }

  const hasActiveFilters = filters.location !== "all" || filters.query !== "" || filters.minPrice !== ""

  return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold">{t("vehicles")}</h1>
              <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(true)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" /> {t("filters")}
              </Button>
            </div>
            <div className="flex gap-8">
              <aside className="hidden w-64 shrink-0 lg:block">
                <ListingFilters type="vehicles" filters={filters} onFilterChange={handleFilterChange} />
                {hasActiveFilters && <Button variant="ghost" className="mt-2 w-full" onClick={clearFilters}><X className="mr-2 h-4 w-4" />{t("clearFilters")}</Button>}
              </aside>
              <div className="flex-1">
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {vehicleAds.map((ad) => (<AdCard key={ad.id} ad={ad} />))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  )
}