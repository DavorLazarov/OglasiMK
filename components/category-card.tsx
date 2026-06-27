"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Home, Smartphone, Briefcase, Wrench, Sofa, type LucideIcon } from "lucide-react"
import { useLanguage } from "./language-provider"

interface CategoryCardProps {
  title: string
  description: string
  href: string
  icon: "car" | "home" | "smartphone" | "briefcase" | "wrench" | "sofa"
  count: number
}

const icons: Record<string, LucideIcon> = {
  car: Car,
  home: Home,
  smartphone: Smartphone,
  briefcase: Briefcase,
  wrench: Wrench,
  sofa: Sofa,
}

export function CategoryCard({ title, description, href, icon, count }: CategoryCardProps) {
  const Icon = icons[icon]
  const { t } = useLanguage()

  return (
    <Link href={href}>
      <Card className="group h-full transition-all hover:shadow-lg hover:border-primary">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary">
            <Icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
          </div>
          <h3 className="mb-1 text-lg font-semibold">{title}</h3>
          <p className="mb-3 text-xs text-muted-foreground">{description}</p>
          <span className="text-sm font-medium text-primary">
            {count} {t("ads")}
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
