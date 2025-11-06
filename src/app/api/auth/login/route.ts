import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        nombre: true,
        passwordHash: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 })
    }

    const isPasswordValid = await compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 })
    }

    const { passwordHash, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "Login exitoso",
        user: userWithoutPassword,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}
