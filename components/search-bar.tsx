"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { LOCATIONS } from "@/lib/types"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL so the bar doesn't "reset" on refresh
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState(searchParams.get("kategorija") || "all")
  const [location, setLocation] = useState(searchParams.get("lokacija") || "all")

  // Sync state if the URL changes externally
  useEffect(() => {
    setQuery(searchParams.get("q") || "")
    setCategory(searchParams.get("kategorija") || "all")
    setLocation(searchParams.get("lokacija") || "all")
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (location !== "all") params.set("lokacija", location)
    if (category !== "all") params.set("kategorija", category)

    // Map categories to their specific routes
    const routeMap: Record<string, string> = {
      "vehicles": "/vozila",
      "real-estate": "/nedviznini",
      "electronics": "/elektronika",
      "careers": "/rabota",
      "services": "/uslugi",
      "furniture": "/mebel",
      "all": "/prebaruvanje"
    }

    const targetRoute = routeMap[category] || "/prebaruvanje"
    router.push(`${targetRoute}?${params.toString()}`)
  }

  return (
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Text Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Што барате?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
            />
          </div>

          {/* Category Select */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Категорија" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Сите</SelectItem>
              <SelectItem value="vehicles">Возила</SelectItem>
              <SelectItem value="real-estate">Недвижнини</SelectItem>
              <SelectItem value="electronics">Електроника</SelectItem>
              <SelectItem value="careers">Работа</SelectItem>
              <SelectItem value="services">Услуги</SelectItem>
              <SelectItem value="furniture">Мебел</SelectItem>
            </SelectContent>
          </Select>

          {/* Location Select */}
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Локација" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Сите локации</SelectItem>
              {LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Submit Button */}
          <Button type="submit" className="w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Пребарај
          </Button>
        </div>
      </form>
  )
}