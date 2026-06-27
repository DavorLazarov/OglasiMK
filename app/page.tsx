"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { CategoryCard } from "@/components/category-card"
import { AdCard } from "@/components/ad-card"
import { useAds } from "@/components/ads-provider"
import { useLanguage } from "@/components/language-provider"

export default function HomePage() {
  const { ads } = useAds()
  const { t } = useLanguage()

  const latestAds = ads.slice(0, 6)
  const vehicleCount = ads.filter((ad) => ad.category === "vehicles").length
  const realEstateCount = ads.filter((ad) => ad.category === "real-estate").length
  const electronicsCount = ads.filter((ad) => ad.category === "electronics").length
  const jobsCount = ads.filter((ad) => ad.category === "jobs").length
  const servicesCount = ads.filter((ad) => ad.category === "services").length
  const furnitureCount = ads.filter((ad) => ad.category === "furniture").length

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground sm:text-xl">{t("heroSubtitle")}</p>
            <div className="mx-auto max-w-3xl rounded-xl bg-card p-4 shadow-lg sm:p-6">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">{t("categories")}</h2>
            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CategoryCard
                title={t("vehicles")}
                description={t("vehiclesDesc")}
                href="/vozila"
                icon="car"
                count={vehicleCount}
              />
              <CategoryCard
                title={t("realEstate")}
                description={t("realEstateDesc")}
                href="/nedviznini"
                icon="home"
                count={realEstateCount}
              />
              <CategoryCard
                title={t("electronics")}
                description={t("electronicsDesc")}
                href="/elektronika"
                icon="smartphone"
                count={electronicsCount}
              />
              <CategoryCard
                title={t("jobs")}
                description={t("jobsDesc")}
                href="/rabota"
                icon="briefcase"
                count={jobsCount}
              />
              <CategoryCard
                title={t("services")}
                description={t("servicesDesc")}
                href="/uslugi"
                icon="wrench"
                count={servicesCount}
              />
              <CategoryCard
                title={t("furniture")}
                description={t("furnitureDesc")}
                href="/mebel"
                icon="sofa"
                count={furnitureCount}
              />
            </div>
          </div>
        </section>

        {/* Latest Ads Section */}
        <section className="bg-secondary/30 px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">{t("latestAds")}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 text-center sm:grid-cols-3">
              <div>
                <p className="text-4xl font-bold text-primary">{ads.length}+</p>
                <p className="mt-2 text-muted-foreground">{t("activeAds")}</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">5</p>
                <p className="mt-2 text-muted-foreground">{t("cities")}</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary">6</p>
                <p className="mt-2 text-muted-foreground">{t("categoriesCount")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
