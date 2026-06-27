"use client"

import { useState, useEffect } from "react" // 1. Added useEffect
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdCard } from "@/components/ad-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/components/auth-provider"
import { useAds } from "@/components/ads-provider"
import { useLanguage } from "@/components/language-provider"
import { User, Mail, Phone, Calendar, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user } = useAuth()
  const { ads, deleteAd } = useAds()
  const { t, language } = useLanguage()
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adToDelete, setAdToDelete] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true) // 2. Loading state

  // 3. Fix: Protect the route inside useEffect
  useEffect(() => {
    if (!user) {
      router.push("/najava")
    } else {
      setIsChecking(false)
    }
  }, [user, router])

  const myAds = ads.filter((ad) => ad.userId === user?.id)

  const handleDeleteClick = (adId: string) => {
    setAdToDelete(adId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (adToDelete) {
      deleteAd(adToDelete)
      setAdToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  // 4. Return null or a loader while checking auth to prevent server crash
  if (isChecking || !user) {
    return null
  }

  return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="mb-8 text-3xl font-bold">{t("profileTitle")}</h1>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                      <User className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle>{user.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {t("memberSince")} {language === "mk" ? "Јануари 2026" : "January 2026"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{user.phone}</span>
                      </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                    {myAds.length} {t("ads")}
                  </span>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                <Tabs defaultValue="my-ads">
                  <TabsList className="mb-6">
                    <TabsTrigger value="my-ads">{t("myAds")}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="my-ads">
                    {myAds.length === 0 ? (
                        <Card>
                          <CardContent className="flex flex-col items-center justify-center py-12">
                            <p className="mb-4 text-muted-foreground">{t("noAds")}</p>
                            <Link href="/objavi">
                              <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                {t("postAd")}
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2">
                          {myAds.map((ad) => (
                              <div key={ad.id} className="relative">
                                <AdCard ad={ad} showFavorite={false} />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute bottom-4 right-4 h-8 w-8"
                                    onClick={() => handleDeleteClick(ad.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                          ))}
                        </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
        <Footer />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("delete")}</AlertDialogTitle>
              <AlertDialogDescription>{t("deleteConfirm")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                {t("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  )
}