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

export default function RealEstatePage() {
  const { ads } = useAds()
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  // 1. Initialize state from URL Search Params
  const [filters, setFilters] = useState({
    location: searchParams.get("lokacija") || "all",
    query: searchParams.get("q") || "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    propertyType: "all",
  })

  // 2. Sync state if URL changes (e.g., user searches again from the Header)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      location: searchParams.get("lokacija") || "all",
      query: searchParams.get("q") || "",
    }))
  }, [searchParams])

  const realEstateAds = useMemo(() => {
    return ads
        .filter((ad) => ad.category === "real-estate")
        .filter((ad) => {
          // Combined Text Search
          if (filters.query && !ad.title.toLowerCase().includes(filters.query.toLowerCase())) return false
          // Location Search
          if (filters.location !== "all" && ad.location !== filters.location) return false
          // Price and Area Filters
          if (filters.minPrice && ad.price < Number(filters.minPrice)) return false
          if (filters.maxPrice && ad.price > Number(filters.maxPrice)) return false
          if (filters.minArea && ad.area && ad.area < Number(filters.minArea)) return false
          if (filters.maxArea && ad.area && ad.area > Number(filters.maxArea)) return false
          if (filters.propertyType !== "all" && ad.propertyType !== filters.propertyType) return false
          return true
        })
  }, [ads, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      location: "all",
      query: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      propertyType: "all",
    })
  }

  const hasActiveFilters =
      filters.location !== "all" ||
      filters.query !== "" ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.minArea ||
      filters.maxArea ||
      filters.propertyType !== "all"

  return (
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{t("realEstate")}</h1>
                <p className="mt-1 text-muted-foreground">
                  {realEstateAds.length} {t("ads")}
                  {filters.query && ` — пребарување за "${filters.query}"`}
                </p>
              </div>
              <Button variant="outline" className="lg:hidden bg-transparent" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                {t("filters")}
              </Button>
            </div>

            <div className="flex gap-8">
              {/* Desktop Filters */}
              <aside className="hidden w-64 shrink-0 lg:block">
                <ListingFilters type="real-estate" filters={filters} onFilterChange={handleFilterChange} />
                {hasActiveFilters && (
                    <Button variant="ghost" className="mt-2 w-full" onClick={clearFilters}>
                      <X className="mr-2 h-4 w-4" />
                      {t("clearFilters")}
                    </Button>
                )}
              </aside>

              {/* Mobile Filters */}
              {showFilters && (
                  <div className="fixed inset-0 z-50 bg-background p-4 lg:hidden">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">{t("filters")}</h2>
                      <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <ListingFilters type="real-estate" filters={filters} onFilterChange={handleFilterChange} />
                    <div className="mt-4 flex gap-2">
                      {hasActiveFilters && (
                          <Button variant="outline" className="flex-1 bg-transparent" onClick={clearFilters}>
                            {t("clearFilters")}
                          </Button>
                      )}
                      <Button className="flex-1" onClick={() => setShowFilters(false)}>
                        {t("apply")} ({realEstateAds.length})
                      </Button>
                    </div>
                  </div>
              )}

              {/* Listings Grid */}
              <div className="flex-1">
                {realEstateAds.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {realEstateAds.map((ad) => (
                          <AdCard key={ad.id} ad={ad} />
                      ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-border bg-card p-12 text-center">
                      <p className="text-muted-foreground">{t("noResults")}</p>
                      {hasActiveFilters && (
                          <Button variant="link" onClick={clearFilters}>
                            {t("clearFilters")}
                          </Button>
                      )}
                    </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
  )
}