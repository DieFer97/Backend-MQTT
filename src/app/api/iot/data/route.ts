import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.sensorData.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}