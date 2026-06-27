"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LOCATIONS, FUEL_TYPES, PROPERTY_TYPES } from "@/lib/types"

interface VehicleFiltersProps {
  type: "vehicles"
  filters: {
    location: string
    minPrice: string
    maxPrice: string
    minYear: string
    maxYear: string
    fuelType: string
  }
  onFilterChange: (key: string, value: string) => void
}

interface RealEstateFiltersProps {
  type: "real-estate"
  filters: {
    location: string
    minPrice: string
    maxPrice: string
    minArea: string
    maxArea: string
    propertyType: string
  }
  onFilterChange: (key: string, value: string) => void
}

type ListingFiltersProps = VehicleFiltersProps | RealEstateFiltersProps

export function ListingFilters({ type, filters, onFilterChange }: ListingFiltersProps) {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <h3 className="font-semibold">Филтри</h3>

      <div className="space-y-2">
        <Label>Локација</Label>
        <Select value={filters.location} onValueChange={(v) => onFilterChange("location", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Сите локации" />
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
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label>Мин. цена (€)</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Макс. цена (€)</Label>
          <Input
            type="number"
            placeholder="∞"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {type === "vehicles" ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Мин. година</Label>
              <Input
                type="number"
                placeholder="2000"
                value={(filters as VehicleFiltersProps["filters"]).minYear}
                onChange={(e) => onFilterChange("minYear", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Макс. година</Label>
              <Input
                type="number"
                placeholder="2026"
                value={(filters as VehicleFiltersProps["filters"]).maxYear}
                onChange={(e) => onFilterChange("maxYear", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Гориво</Label>
            <Select
              value={(filters as VehicleFiltersProps["filters"]).fuelType}
              onValueChange={(v) => onFilterChange("fuelType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Сите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Сите</SelectItem>
                {FUEL_TYPES.map((fuel) => (
                  <SelectItem key={fuel} value={fuel}>
                    {fuel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Мин. м²</Label>
              <Input
                type="number"
                placeholder="0"
                value={(filters as RealEstateFiltersProps["filters"]).minArea}
                onChange={(e) => onFilterChange("minArea", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Макс. м²</Label>
              <Input
                type="number"
                placeholder="∞"
                value={(filters as RealEstateFiltersProps["filters"]).maxArea}
                onChange={(e) => onFilterChange("maxArea", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Тип</Label>
            <Select
              value={(filters as RealEstateFiltersProps["filters"]).propertyType}
              onValueChange={(v) => onFilterChange("propertyType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Сите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Сите</SelectItem>
                {PROPERTY_TYPES.map((prop) => (
                  <SelectItem key={prop} value={prop}>
                    {prop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  )
}
