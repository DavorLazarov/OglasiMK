"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdCard } from "@/components/ad-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAds } from "@/components/ads-provider"
import { useLanguage } from "@/components/language-provider"
import { LOCATIONS } from "@/lib/types"
import { SlidersHorizontal } from "lucide-react"

// Главната компонента служи само како безбедна Suspense обвивка за серверот
export default function PrebaruvanjePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-background">
                <p className="text-muted-foreground animate-pulse">Вчитавање на страницата за пребарување...</p>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    )
}

function SearchPageContent() {
    const searchParams = useSearchParams()
    const { ads = [] } = useAds()
    const { t } = useLanguage()

    const urlQuery = searchParams.get("q") || ""
    const categoryParam = searchParams.get("kategorija") || "all"
    const locationParam = searchParams.get("lokacija") || "all"

    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [sortBy, setSortBy] = useState<string>("newest")

    const sortedAds = useMemo(() => {
        const cleanQuery = urlQuery.toLowerCase().trim()

        let filtered = (ads || []).filter((ad) => {
            if (cleanQuery && cleanQuery !== "undefined" && cleanQuery !== "null") {
                const titleMatch = ad.title?.toLowerCase().includes(cleanQuery)
                const descMatch = ad.description?.toLowerCase().includes(cleanQuery)
                if (!titleMatch && !descMatch) return false
            }

            if (categoryParam !== "all" && categoryParam !== "undefined") {
                if (ad.category !== categoryParam) return false
            }

            if (locationParam !== "all" && locationParam !== "undefined") {
                if (ad.location !== locationParam) return false
            }

            if (minPrice && ad.price < Number(minPrice)) return false
            if (maxPrice && ad.price > Number(maxPrice)) return false

            return true
        })

        return filtered.sort((a, b) => {
            if (sortBy === "price-asc") return a.price - b.price
            if (sortBy === "price-desc") return b.price - a.price
            if (sortBy === "newest") {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
                return dateB - dateA
            }
            return 0
        })
    }, [ads, urlQuery, categoryParam, locationParam, minPrice, maxPrice, sortBy])

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search)
        if (value && value !== "all") {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        window.location.href = `/prebaruvanje?${params.toString()}`
    }

    const clearFilters = () => {
        window.location.href = "/prebaruvanje"
    }

    const filterSidebar = (
        <div className="space-y-6">
            <div>
                <Label>Категорија</Label>
                <Select value={categoryParam} onValueChange={(val) => handleFilterChange("kategorija", val)}>
                    <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Избери категорија" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Сите категории</SelectItem>
                        <SelectItem value="real-estate">Недвижности</SelectItem>
                        <SelectItem value="vehicles">Возила</SelectItem>
                        <SelectItem value="electronics">Електроника</SelectItem>
                        <SelectItem value="furniture">Мебел</SelectItem>
                        <SelectItem value="jobs">Работа</SelectItem>
                        <SelectItem value="services">Услуги</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>{t("location") || "Локација"}</Label>
                <Select value={locationParam} onValueChange={(val) => handleFilterChange("lokacija", val)}>
                    <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Избери град" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Сите градови</SelectItem>
                        {LOCATIONS?.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                                {loc}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Цена (МКД)</Label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        placeholder="Од"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full"
                    />
                    <Input
                        type="number"
                        placeholder="До"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            <Button onClick={clearFilters} variant="outline" className="w-full mt-2">
                Ресетирај филтри
            </Button>
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />

            <main className="flex-1 container mx-auto py-6 px-4 max-w-7xl">
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        Филтри
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px]">
                                    <SheetHeader className="mb-4 text-left">
                                        <SheetTitle>Филтрирај огласи</SheetTitle>
                                    </SheetHeader>
                                    {filterSidebar}
                                </SheetContent>
                            </Sheet>
                        </div>

                        <p className="text-sm text-muted-foreground hidden sm:block">
                            Пронајдени <span className="font-semibold text-foreground">{sortedAds.length}</span> огласи
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Label htmlFor="sort" className="text-sm text-muted-foreground shrink-0 hidden sm:inline">
                            Сортирај по:
                        </Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger id="sort" className="w-[170px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Најнови огласи</SelectItem>
                                <SelectItem value="price-asc">Цена: Ниска → Висока</SelectItem>
                                <SelectItem value="price-desc">Цена: Висока → Ниска</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="hidden md:block w-64 shrink-0 border-r pr-6">
                        <h2 className="font-semibold text-lg tracking-tight mb-4">Филтри</h2>
                        {filterSidebar}
                    </aside>

                    <div className="flex-1">
                        {urlQuery && (
                            <h1 className="text-xl mb-4 text-muted-foreground">
                                Резултати за: <span className="font-semibold text-foreground">"{urlQuery}"</span>
                            </h1>
                        )}

                        {sortedAds.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedAds.map((ad) => (
                                    <AdCard key={ad.id} ad={ad} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-20 bg-muted/20 rounded-lg border border-dashed px-4">
                                <p className="text-lg font-medium mb-1">Нема пронајдено огласи</p>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Пробајте да ги смените филтрите или проверете го внесениот збор.
                                </p>
                                <Button onClick={clearFilters} variant="link" className="mt-2 text-primary">
                                    Исчисти ги сите филтри
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}