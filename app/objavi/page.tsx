"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import {
  LOCATIONS,
  FUEL_TYPES,
  PROPERTY_TYPES,
  CONDITION_TYPES,
  JOB_TYPES,
  SERVICE_TYPES,
  FURNITURE_TYPES,
} from "@/lib/types"
import { Loader2, CheckCircle, Car, Home, Smartphone, Briefcase, Wrench, Sofa } from "lucide-react"

type Category = "vehicles" | "real-estate" | "electronics" | "jobs" | "services" | "furniture"

export default function CreateAdPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [category, setCategory] = useState<Category>("vehicles")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    phone: "",
    email: "",
    image: "/placeholder.svg", // Почетна вредност за слика
    brand: "",
    model: "",
    year: "",
    mileage: "",
    fuelType: "",
    area: "",
    rooms: "",
    propertyType: "",
    condition: "",
    jobType: "",
    salary: "",
    serviceType: "",
    furnitureType: "",
  })

  // Автоматско пополнување податоци од корисникот
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        phone: user.phone || ""
      }))
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Мора да сте најавени за да објавите оглас.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category,
          userId: user.id,
          price: Number(formData.price) || 0,
          year: formData.year ? Number(formData.year) : null,
          mileage: formData.mileage ? Number(formData.mileage) : null,
          area: formData.area ? Number(formData.area) : null,
          rooms: formData.rooms ? Number(formData.rooms) : null,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => router.push("/"), 2000)
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Грешка при објавување")
      }
    } catch (error) {
      console.error("Submission error:", error)
      alert("Настана грешка при комуникација со серверот.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/najava")
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </main>
          <Footer />
        </div>
    )
  }

  if (isSuccess) {
    return (
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex flex-1 items-center justify-center px-4 py-16">
            <Card className="w-full max-w-md text-center border-green-500">
              <CardContent className="pt-6">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-4 text-2xl font-bold">{t("seller")}</h2>
                <p className="mt-2 text-muted-foreground">Ве враќаме на почетната страна...</p>
              </CardContent>
            </Card>
          </main>
          <Footer />
        </div>
    )
  }

  const categoriesList: { value: Category; label: string; icon: React.ReactNode }[] = [
    { value: "vehicles", label: t("vehicle"), icon: <Car className="h-4 w-4" /> },
    { value: "real-estate", label: t("property"), icon: <Home className="h-4 w-4" /> },
    { value: "electronics", label: t("electronic"), icon: <Smartphone className="h-4 w-4" /> },
    { value: "jobs", label: t("job"), icon: <Briefcase className="h-4 w-4" /> },
    { value: "services", label: t("service"), icon: <Wrench className="h-4 w-4" /> },
    { value: "furniture", label: t("furnitureItem"), icon: <Sofa className="h-4 w-4" /> },
  ]

  return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">{t("createAdTitle")}</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Selection */}
              <Card>
                <CardHeader><CardTitle className="text-lg">{t("category")}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {categoriesList.map((cat) => (
                        <Button
                            key={cat.value}
                            type="button"
                            variant={category === cat.value ? "default" : "outline"}
                            className={`gap-2 ${category !== cat.value ? "bg-transparent" : ""}`}
                            onClick={() => setCategory(cat.value)}
                        >
                          {cat.icon} {cat.label}
                        </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card>
                <CardHeader><CardTitle className="text-lg">{t("basicInfo")}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t("title")} *</Label>
                    <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">{t("description")} *</Label>
                    <Textarea id="description" rows={5} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} required />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">{t("price")} *</Label>
                      <Input id="price" type="number" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">{t("location")} *</Label>
                      <Select value={formData.location} onValueChange={(v) => handleInputChange("location", v)} required>
                        <SelectTrigger><SelectValue placeholder={t("selectLocation")} /></SelectTrigger>
                        <SelectContent>
                          {LOCATIONS.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">URL на слика</Label>
                    <Input
                        id="image"
                        placeholder="https://example.com/slika.jpg"
                        value={formData.image}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Category Specific Details */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Детали за категоријата</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {category === "vehicles" && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Марка</Label>
                          <Input value={formData.brand} onChange={e => handleInputChange("brand", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Модел</Label>
                          <Input value={formData.model} onChange={e => handleInputChange("model", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Година</Label>
                          <Input type="number" value={formData.year} onChange={e => handleInputChange("year", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Гориво</Label>
                          <Select value={formData.fuelType} onValueChange={v => handleInputChange("fuelType", v)}>
                            <SelectTrigger><SelectValue placeholder="Тип на гориво" /></SelectTrigger>
                            <SelectContent>
                              {FUEL_TYPES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                  )}

                  {category === "real-estate" && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Површина (m²)</Label>
                          <Input type="number" value={formData.area} onChange={e => handleInputChange("area", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Број на соби</Label>
                          <Input type="number" value={formData.rooms} onChange={e => handleInputChange("rooms", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Тип на имот</Label>
                          <Select value={formData.propertyType} onValueChange={v => handleInputChange("propertyType", v)}>
                            <SelectTrigger><SelectValue placeholder="Избери тип" /></SelectTrigger>
                            <SelectContent>
                              {PROPERTY_TYPES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                  )}

                  {category === "electronics" && (
                      <div className="space-y-2">
                        <Label>Состојба</Label>
                        <Select value={formData.condition} onValueChange={v => handleInputChange("condition", v)}>
                          <SelectTrigger><SelectValue placeholder="Избери состојба" /></SelectTrigger>
                          <SelectContent>
                            {CONDITION_TYPES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                  )}

                  {category === "jobs" && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Тип на вработување</Label>
                          <Select value={formData.jobType} onValueChange={v => handleInputChange("jobType", v)}>
                            <SelectTrigger><SelectValue placeholder="Избери" /></SelectTrigger>
                            <SelectContent>
                              {JOB_TYPES.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Плата (опционално)</Label>
                          <Input value={formData.salary} onChange={e => handleInputChange("salary", e.target.value)} />
                        </div>
                      </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader><CardTitle className="text-lg">{t("contactInfo")}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")} *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
                  {t("cancel")}
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("publishing")}</> : t("postAd")}
                </Button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
  )
}