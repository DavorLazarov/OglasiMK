"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { LOCATIONS } from "@/lib/types"

export function SearchBar() {
  const searchParams = useSearchParams()

  // Иницијализација директно и единствено од URL при вчитавање
  const qParam = searchParams.get("q") || ""
  const katParam = searchParams.get("kategorija") || "all"
  const locParam = searchParams.get("lokacija") || "all"

  const [inputValue, setInputValue] = useState(qParam)
  const [category, setCategory] = useState(katParam)
  const [location, setLocation] = useState(locParam)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (inputValue.trim()) params.set("q", inputValue.trim())
    if (location !== "all") params.set("lokacija", location)
    if (category !== "all") params.set("kategorija", category)

    const routeMap: Record<string, string> = {
      "vehicles": "/vozila",
      "real-estate": "/nedviznini",
      "electronics": "/elektronika",
      "jobs": "/rabota",
      "services": "/uslugi",
      "furniture": "/mebel",
      "all": "/prebaruvanje"
    }

    const targetRoute = routeMap[category] || "/prebaruvanje"

    // Чист рефреш со новото куери — го гази стариот клуч целосно
    window.location.href = `${targetRoute}?${params.toString()}`
  }

  return (
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Што барате?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-10"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Категорија" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Сите</SelectItem>
              <SelectItem value="vehicles">Возила</SelectItem>
              <SelectItem value="real-estate">Недвижнини</SelectItem>
              <SelectItem value="electronics">Електроника</SelectItem>
              <SelectItem value="jobs">Работа</SelectItem>
              <SelectItem value="services">Услуги</SelectItem>
              <SelectItem value="furniture">Мебел</SelectItem>
            </SelectContent>
          </Select>

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Локација" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Сите локации</SelectItem>
              {LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" className="w-full sm:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Пребарај
          </Button>
        </div>
      </form>
  )
}