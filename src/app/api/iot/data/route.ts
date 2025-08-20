import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '200');
    const fecha = searchParams.get('fecha');

    let whereClause = {};
    if (fecha) {
      const startOfDay = new Date(fecha);
      const endOfDay = new Date(fecha);
      endOfDay.setDate(endOfDay.getDate() + 1);

      whereClause = {
        timestamp: {
          gte: startOfDay,
          lt: endOfDay
        }
      };
    }
    
    const data = await prisma.sensorData.findMany({
      where: whereClause,
      orderBy: { timestamp: "desc" },
      take: limit,
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}