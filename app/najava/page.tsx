"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const { login, user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Redirect if already logged in - must be before any early returns
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  // Wait for auth to load, then check if user is logged in
  if (authLoading) return null
  if (user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFormLoading(true)

    const success = await login(formData.email, formData.password)

    if (success) {
      router.push("/")
    } else {
      setError("Невалидна е-пошта или лозинка")
    }

    setFormLoading(false)
  }

  return (
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Најава</CardTitle>
              <CardDescription>Внесете ги вашите податоци за да се најавите</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Е-пошта</Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="vase.ime@primer.mk"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Лозинка</Label>
                  <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={formLoading}>
                  {formLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Најавување...
                      </>
                  ) : (
                      "Најави се"
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Немате сметка?{" "}
                  <Link href="/registracija" className="text-primary hover:underline">
                    Регистрирајте се
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </main>

        <Footer />
      </div>
  )
}