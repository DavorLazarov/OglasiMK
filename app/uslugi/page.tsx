"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdCard } from "@/components/ad-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAds } from "@/components/ads-provider"
import { useLanguage } from "@/components/language-provider"
import { LOCATIONS, SERVICE_TYPES } from "@/lib/types"
import { SlidersHorizontal, Wrench } from "lucide-react"

export default function ServicesPage() {
  const { ads } = useAds()
  const { t } = useLanguage()
  const searchParams = useSearchParams()

  // 1. Initialize from URL params
  const query = searchParams.get("q") || ""
  const [location, setLocation] = useState<string>(searchParams.get("lokacija") || "all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [serviceType, setServiceType] = useState<string>("all")

  // 2. Keep location in sync if user searches again via the Header SearchBar
  useEffect(() => {
    const loc = searchParams.get("lokacija") || "all"
    setLocation(loc)
  }, [searchParams])

  // 3. Filtering logic with text search (q) support
  const serviceAds = useMemo(() => {
    return ads.filter((ad) => {
      if (ad.category !== "services") return false

      // Text Search
      if (query && !ad.title.toLowerCase().includes(query.toLowerCase())) return false

      // Location & Specific Filters
      if (location !== "all" && ad.location !== location) return false
      if (minPrice && ad.price < Number(minPrice)) return false
      if (maxPrice && ad.price > Number(maxPrice)) return false
      if (serviceType !== "all" && ad.serviceType !== serviceType) return false

      return true
    })
  }, [ads, location, minPrice, maxPrice, serviceType, query])

  const clearFilters = () => {
    setLocation("all")
    setMinPrice("")
    setMaxPrice("")
    setServiceType("all")
  }

  // Define sidebar content as a variable (not a function component) to fix focus loss
  const sidebarContent = (
      <div className="space-y-6">
        <div>
          <Label>{t("location")}</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={t("allLocations")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allLocations")}</SelectItem>
              {LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t("priceRange")}</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Input
                type="text"
                inputMode="numeric"
                placeholder={t("minPrice")}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))}
            />
            <Input
                type="text"
                inputMode="numeric"
                placeholder={t("maxPrice")}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        <div>
          <Label>{t("serviceType")}</Label>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={t("allServiceTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allServiceTypes")}</SelectItem>
              {SERVICE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
          {t("clearFilters")}
        </Button>
      </div>
  )

  return (
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wrench className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">{t("services")}</h1>
                  <p className="text-muted-foreground">
                    {serviceAds.length} {t("ads")}
                    {query && ` — резултати за "${query}"`}
                  </p>
                </div>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 lg:hidden bg-transparent">
                    <SlidersHorizontal className="h-4 w-4" />
                    {t("filters")}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{t("filters")}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    {sidebarContent}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="grid gap-8 lg:grid-cols-4">
              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
                  <h2 className="mb-6 font-semibold">{t("filters")}</h2>
                  {sidebarContent}
                </div>
              </aside>

              <div className="lg:col-span-3">
                {serviceAds.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-12 text-center">
                      <p className="text-muted-foreground">{t("noResults")}</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {serviceAds.map((ad) => (
                          <AdCard key={ad.id} ad={ad} />
                      ))}
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