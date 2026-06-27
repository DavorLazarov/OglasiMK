import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return new Response('Success', { status: 200 })
    }

    try {
        // LAZY IMPORT: Hides Prisma from the build-time static scan
        const { prisma } = await import("@/lib/prisma")

        const { email, password } = await req.json()
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        const { password: _, ...userWithoutPassword } = user
        return NextResponse.json(userWithoutPassword)
    } catch (error) {
        return NextResponse.json({ error: "Login failed" }, { status: 500 })
    }
}