import { prisma } from "@/lib/prisma"
import { compare, hash } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, currentPassword, newPassword, newEmail } = body

    if (!email && !name && !newPassword && !newEmail) {
      return NextResponse.json({ error: "No hay cambios para guardar" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    if (newPassword) {
      if (!currentPassword)
        return NextResponse.json({ error: "Debes ingresar tu contraseña actual" }, { status: 400 })

      const isValid = await compare(currentPassword, user.passwordHash)
      if (!isValid)
        return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        nombre: name ?? user.nombre,
        email: newEmail ?? user.email,
        passwordHash: newPassword ? await hash(newPassword, 10) : user.passwordHash,
      },
      select: { id: true, nombre: true, email: true, createdAt: true },
    })

    return NextResponse.json(
      { message: "Perfil actualizado correctamente", user: updatedUser },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error al actualizar perfil:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
