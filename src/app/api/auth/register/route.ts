import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, nombre, password } = body

    if (!email || !nombre || !password) {
      return NextResponse.json({ error: "Email, nombre y contraseña son requeridos" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
    }

    const passwordHash = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        nombre,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
  }
}
