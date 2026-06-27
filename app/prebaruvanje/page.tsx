"use client"

import { useState, useMemo } from "react" // Added useMemo for performance
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
import { LOCATIONS } from "@/lib/types"
import { SlidersHorizontal, LayoutGrid } from "lucide-react"

export default function AllAdsPage() {
    const { ads } = useAds()
    const { t } = useLanguage()
    const searchParams = useSearchParams()

    const queryParam = searchParams.get("q") || ""
    const locationParam = searchParams.get("lokacija") || "all"
    const categoryParam = searchParams.get("kategorija") || "all"

    const [location, setLocation] = useState<string>(locationParam)
    const [category, setCategory] = useState<string>(categoryParam)
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [sortBy, setSortBy] = useState<string>("newest")

    // Using useMemo to calculate filtered and sorted ads efficiently
    const sortedAds = useMemo(() => {
        let filtered = ads.filter((ad) => {
            if (queryParam && !ad.title.toLowerCase().includes(queryParam.toLowerCase())) return false
            if (category !== "all" && ad.category !== category) return false
            if (location !== "all" && ad.location !== location) return false
            if (minPrice && ad.price < Number(minPrice)) return false
            if (maxPrice && ad.price > Number(maxPrice)) return false
            return true
        })

        return filtered.sort((a, b) => {
            if (sortBy === "price-asc") return a.price - b.price
            if (sortBy === "price-desc") return b.price - a.price
            if (sortBy === "newest") {
                // Fallback to 0 if createdAt is missing
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                return dateB - dateA
            }
            return 0
        })
    }, [ads, queryParam, category, location, minPrice, maxPrice, sortBy])

    const clearFilters = () => {
        setLocation("all")
        setCategory("all")
        setMinPrice("")
        setMaxPrice("")
        setSortBy("newest")
    }

    // Define the filter UI inside the main return to prevent focus loss
    const filterSidebar = (
        <div className="space-y-6">
            <div>
                <Label>Категорија</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Сите категории</SelectItem>
                        <SelectItem value="vehicles">Возила</SelectItem>
                        <SelectItem value="real-estate">Недвижнини</SelectItem>
                        <SelectItem value="electronics">Електроника</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Цена (ден.)</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Од"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="До"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
            </div>

            <div>
                <Label>{t("location")}</Label>
                <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t("allLocations")}</SelectItem>
                        {LOCATIONS.map((loc) => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
                Избриши филтри
            </Button>
        </div>
    )

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 px-4 py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <LayoutGrid className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">Огласи</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Сортирај:</span>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Најнови</SelectItem>
                                    <SelectItem value="price-asc">Цена: Најниска</SelectItem>
                                    <SelectItem value="price-desc">Цена: Највисока</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-4">
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 rounded-lg border p-6 bg-card">
                                <h2 className="mb-6 font-semibold">Филтри</h2>
                                {filterSidebar}
                            </div>
                        </aside>

                        <div className="lg:col-span-3">
                            {sortedAds.length === 0 ? (
                                <div className="p-12 text-center border rounded-lg text-muted-foreground">Нема резултати.</div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {sortedAds.map((ad) => <AdCard key={ad.id} ad={ad} />)}
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