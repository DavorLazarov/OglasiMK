import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Огласот не е пронајден</h1>
          <p className="mt-4 text-muted-foreground">Огласот што го барате не постои или е отстранет.</p>
          <Link href="/">
            <Button className="mt-8 gap-2">
              <Home className="h-4 w-4" />
              Врати се на почетна
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
