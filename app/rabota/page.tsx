"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdCard } from "@/components/ad-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAds } from "@/components/ads-provider"
import { useLanguage } from "@/components/language-provider"
import { LOCATIONS, JOB_TYPES } from "@/lib/types"
import { SlidersHorizontal, Briefcase } from "lucide-react"

export default function JobsPage() {
  const { ads } = useAds()
  const { t } = useLanguage()
  const searchParams = useSearchParams()

  // 1. Initial State from URL
  const query = searchParams.get("q") || ""
  const [location, setLocation] = useState<string>(searchParams.get("lokacija") || "all")
  const [jobType, setJobType] = useState<string>("all")

  // 2. Sync if SearchBar is used while already on this page
  useEffect(() => {
    const loc = searchParams.get("lokacija") || "all"
    setLocation(loc)
  }, [searchParams])

  // 3. Optimized Filtering Logic
  const jobAds = useMemo(() => {
    return ads.filter((ad) => {
      if (ad.category !== "jobs") return false

      // Text Search Filter (q)
      if (query && !ad.title.toLowerCase().includes(query.toLowerCase())) return false

      // Category Specific Filters
      if (location !== "all" && ad.location !== location) return false
      if (jobType !== "all" && ad.jobType !== jobType) return false

      return true
    })
  }, [ads, location, jobType, query])

  const clearFilters = () => {
    setLocation("all")
    setJobType("all")
  }

  // Sidebar Content moved out of render function to avoid unnecessary unmounting
  const sidebarContent = (
      <div className="space-y-6">
        <div>
          <Label>{t("location")}</Label>
          <span className="sr-only">Избери локација</span>
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
          <Label>{t("jobType")}</Label>
          <span className="sr-only">Избери тип на вработување</span>
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={t("allJobTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allJobTypes")}</SelectItem>
              {JOB_TYPES.map((type) => (
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
                <Briefcase className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">{t("jobs")}</h1>
                  <p className="text-muted-foreground">
                    {jobAds.length} {t("ads")}
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
                  <div className="mt-6">
                    <h2 className="mb-6 text-lg font-semibold">{t("filters")}</h2>
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
                {jobAds.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-12 text-center">
                      <p className="text-muted-foreground">{t("noResults")}</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {jobAds.map((ad) => (
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