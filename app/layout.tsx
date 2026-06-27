import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { LanguageProvider } from "@/components/language-provider"
import { AdsProvider } from "@/components/ads-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Огласи МК - Огласник за Северна Македонија",
  description: "Најголемиот огласник за возила и недвижнини во Северна Македонија. Продавај и купувај лесно!",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#d97706",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="mk">
      <body className="font-sans antialiased">
      <LanguageProvider>
        {/* AuthProvider must be higher than AdsProvider */}
        <AuthProvider>
          <AdsProvider>
            {children}
          </AdsProvider>
        </AuthProvider>
      </LanguageProvider>
      <Analytics />
      </body>
      </html>
  )
}
