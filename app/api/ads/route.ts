import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return new Response('Success', { status: 200 })
    }

    try {
        const { prisma } = await import("@/lib/prisma")
        const body = await req.json()

        // 1. Екстракција на основните полиња
        const {
            title, description, price, category, location,
            image, userId, phone, email, ...rest
        } = body

        if (!userId || !title) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // 2. Снимање со вклучени контакт податоци и JSON детали
        const newAd = await prisma.ad.create({
            data: {
                title,
                description,
                price: parseFloat(price) || 0,
                category,
                location,
                image: image || "/placeholder.svg",
                phone: phone || null,
                email: email || null,
                userId: Number(userId),
                // Сите останати полиња (brand, model, area, rooms...) ги пакуваме во details
                details: JSON.stringify(rest)
            },
        })

        return NextResponse.json(newAd, { status: 201 })
    } catch (error: any) {
        console.error("AD_CREATE_ERROR:", error)
        return NextResponse.json({ error: "Грешка при зачувување", details: error.message }, { status: 500 })
    }
}

export async function GET() {
    try {
        const { prisma } = await import("@/lib/prisma")

        const ads = await prisma.ad.findMany({
            orderBy: {
                id: 'desc'
            },
            include: {
                // 3. ВКЛУЧУВАЊЕ НА АВТОРОТ (за да не пишува "Приватен корисник")
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json(ads)
    } catch (error) {
        console.error("ADS_FETCH_ERROR:", error)
        return NextResponse.json({ error: "Грешка при вчитување" }, { status: 500 })
    }
}