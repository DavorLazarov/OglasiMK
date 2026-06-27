import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { prisma } = await import("@/lib/prisma")
        const params = await context.params
        const userId = parseInt(params.id)

        const favorites = await prisma.favorite.findMany({
            where: { userId },
        })

        return NextResponse.json(favorites || [])
    } catch (error) {
        console.error("FAVORITES_GET_ERROR:", error)
        return NextResponse.json([], { status: 500 })
    }
}
