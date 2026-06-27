"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { Ad } from "@/lib/types"
import { useAuth } from "./auth-provider"

interface AdsContextType {
  ads: Ad[]
  favorites: number[]
  toggleFavorite: (id: number) => Promise<void>
  isFavorite: (id: number) => boolean
  isLoading: boolean
  refreshAds: () => Promise<void>
  deleteAd: (id: number) => Promise<void>
}

const AdsContext = createContext<AdsContextType | undefined>(undefined)

export function AdsProvider({ children }: { children: ReactNode }) {
  const [ads, setAds] = useState<Ad[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  // 1. Влечење на сите огласи
  const refreshAds = async () => {
    try {
      const res = await fetch("/api/ads")
      if (res.ok) {
        const data = await res.json()
        setAds(data)
      }
    } catch (e) {
      console.error("Failed to fetch ads:", e)
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Бришење на оглас
  const deleteAd = async (adId: number) => {
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAds((prev) => prev.filter((ad) => ad.id !== adId))
        setFavorites((prev) => prev.filter((id) => id !== adId))
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Грешка при бришење на огласот")
      }
    } catch (error) {
      console.error("Error deleting ad:", error)
    }
  }

  // 3. Тоглирање омилени
  const toggleFavorite = async (adId: number) => {
    if (!user) {
      router.push("/najava")
      return
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, adId }),
      })

      if (response.ok) {
        setFavorites((prev) =>
            prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
        )
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const isFavorite = (id: number) => favorites.includes(id)

  useEffect(() => {
    refreshAds()
  }, [])

  useEffect(() => {
    if (user) {
      fetch(`/api/favorites/${user.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setFavorites(data.map((fav: any) => fav.adId))
            } else {
              setFavorites([])
            }
          })
          .catch(console.error)
    } else {
      setFavorites([])
    }
  }, [user])

  // КЛУЧНО: return мора да биде НАЈДОЛЕ, по сите дефиниции на функции
  return (
      <AdsContext.Provider
          value={{
            ads,
            favorites,
            toggleFavorite,
            isFavorite,
            isLoading,
            refreshAds,
            deleteAd
          }}
      >
        {children}
      </AdsContext.Provider>
  )
}

export function useAds() {
  const context = useContext(AdsContext)
  if (!context) {
    throw new Error("useAds must be used within an AdsProvider")
  }
  return context
}