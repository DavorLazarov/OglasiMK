"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { useLanguage } from "./language-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Car, Home, Plus, User, LogOut, Menu, Globe, Heart, Smartphone, Briefcase, Wrench, Sofa } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">О</span>
            </div>
            <span className="text-xl font-bold text-foreground">{t("siteName")}</span>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex">
            <Link
              href="/vozila"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Car className="h-4 w-4" />
              {t("vehicles")}
            </Link>
            <Link
              href="/nedviznini"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              {t("realEstate")}
            </Link>
            <Link
              href="/elektronika"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Smartphone className="h-4 w-4" />
              {t("electronics")}
            </Link>
            <Link
              href="/rabota"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Briefcase className="h-4 w-4" />
              {t("jobs")}
            </Link>
            <Link
              href="/uslugi"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Wrench className="h-4 w-4" />
              {t("services")}
            </Link>
            <Link
              href="/mebel"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Sofa className="h-4 w-4" />
              {t("furniture")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("mk")} className={language === "mk" ? "bg-accent" : ""}>
                🇲🇰 Македонски
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              <Link href="/objavi" className="hidden sm:block">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("postAd")}
                </Button>
              </Link>
              <Link href="/omileni">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">{user.name}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profil" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t("profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/omileni" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      {t("favorites")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="sm:hidden">
                    <Link href="/objavi" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {t("postAd")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/objavi" className="hidden sm:block">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("postAd")}
                </Button>
              </Link>
              <Link href="/omileni">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
              </Link>
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/najava">
                  <Button variant="ghost">{t("login")}</Button>
                </Link>
                <Link href="/registracija">
                  <Button>{t("register")}</Button>
                </Link>
              </div>
            </>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/vozila"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Car className="h-4 w-4" />
              {t("vehicles")}
            </Link>
            <Link
              href="/nedviznini"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              {t("realEstate")}
            </Link>
            <Link
              href="/elektronika"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Smartphone className="h-4 w-4" />
              {t("electronics")}
            </Link>
            <Link
              href="/rabota"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Briefcase className="h-4 w-4" />
              {t("jobs")}
            </Link>
            <Link
              href="/uslugi"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Wrench className="h-4 w-4" />
              {t("services")}
            </Link>
            <Link
              href="/mebel"
              className="flex items-center gap-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sofa className="h-4 w-4" />
              {t("furniture")}
            </Link>
            {!user && (
              <>
                <div className="my-2 border-t border-border" />
                <Link href="/objavi" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    {t("postAd")}
                  </Button>
                </Link>
                <Link href="/najava" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent">
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/registracija" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">{t("register")}</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
