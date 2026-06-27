// api/favorites/route.ts
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { prisma } = await import("@/lib/prisma")
        const { userId, adId } = await req.json()

        const existing = await prisma.favorite.findUnique({
            where: {
                userId_adId: {
                    userId: Number(userId),
                    adId: Number(adId)
                }
            }
        })

        if (existing) {
            await prisma.favorite.delete({
                where: { userId_adId: { userId: Number(userId), adId: Number(adId) } }
            })
            return NextResponse.json({ message: "Removed" })
        }

        const newFavorite = await prisma.favorite.create({
            data: { userId: Number(userId), adId: Number(adId) },
        })
        return NextResponse.json(newFavorite, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Грешка" }, { status: 500 })
    }
}