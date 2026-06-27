"use client"

import { useState, useMemo } from "react"
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
import { LOCATIONS, CONDITION_TYPES } from "@/lib/types"
import { SlidersHorizontal, Smartphone } from "lucide-react"

export default function ElectronicsPage() {
  const { ads } = useAds()
  const { t } = useLanguage()
  const searchParams = useSearchParams()

  // Initialize from URL
  const [location, setLocation] = useState<string>(searchParams.get("lokacija") || "all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [condition, setCondition] = useState<string>("all")
  const query = searchParams.get("q") || ""

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      if (ad.category !== "electronics") return false
      if (query && !ad.title.toLowerCase().includes(query.toLowerCase())) return false
      if (location !== "all" && ad.location !== location) return false
      if (minPrice && ad.price < Number(minPrice)) return false
      if (maxPrice && ad.price > Number(maxPrice)) return false
      if (condition !== "all" && ad.condition !== condition) return false
      return true
    })
  }, [ads, location, minPrice, maxPrice, condition, query])

  const clearFilters = () => {
    setLocation("all")
    setMinPrice("")
    setMaxPrice("")
    setCondition("all")
  }

  // Moved outside the return to stop focus loss
  const sidebarContent = (
      <div className="space-y-6">
        <div>
          <Label>{t("location")}</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allLocations")}</SelectItem>
              {LOCATIONS.map((loc) => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t("priceRange")}</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Input
                type="text" inputMode="numeric" placeholder="Од"
                value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))}
            />
            <Input
                type="text" inputMode="numeric" placeholder="До"
                value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
            />
          </div>
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
                <Smartphone className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">{t("electronics")}</h1>
                  <p className="text-muted-foreground">{filteredAds.length} {t("ads")}</p>
                </div>
              </div>
              <Sheet>
                <SheetTrigger asChild><Button variant="outline" className="lg:hidden bg-transparent"><SlidersHorizontal className="h-4 w-4" /></Button></SheetTrigger>
                <SheetContent><div className="mt-6">{sidebarContent}</div></SheetContent>
              </Sheet>
            </div>
            <div className="grid gap-8 lg:grid-cols-4">
              <aside className="hidden lg:block"><div className="sticky top-24 border rounded-lg p-6 bg-card">{sidebarContent}</div></aside>
              <div className="lg:col-span-3">
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredAds.map((ad) => (<AdCard key={ad.id} ad={ad} />))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  )
}