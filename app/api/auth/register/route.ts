import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Tell Next.js to skip this during build data collection
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    // 1. Safety check for build phase
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return new Response('Success', { status: 200 })
    }

    try {
        // 2. DYNAMIC IMPORT: Hides Prisma from the build-time static scan
        const { prisma } = await import("@/lib/prisma")

        const { name, email, password } = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // 3. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: "Емаил адресата веќе постои" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // 4. Create user in SQLite
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        return NextResponse.json({ success: true, userId: user.id })
    } catch (error) {
        console.error("REGISTRATION_ERROR:", error)
        return NextResponse.json({ error: "Грешка при креирање профил" }, { status: 500 })
    }
}