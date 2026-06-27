import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Дефинираме дека params е Promise
) {
    try {
        const { prisma } = await import("@/lib/prisma")

        // 1. КЛУЧНО: Мора да направиш await на params
        const resolvedParams = await params
        const id = parseInt(resolvedParams.id)

        if (isNaN(id)) {
            return NextResponse.json({ error: "Невалидно ID" }, { status: 400 })
        }

        // 2. Бришење на омилени поврзани со огласот
        await prisma.favorite.deleteMany({
            where: { adId: id }
        })

        // 3. Бришење на самиот оглас
        await prisma.ad.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Огласот е избришан" })
    } catch (error: any) {
        console.error("DELETE_ERROR:", error)
        return NextResponse.json(
            { error: "Грешка при бришење", details: error.message },
            { status: 500 }
        )
    }
}