import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("userId");

    if (!userIdParam) {
      return NextResponse.json({ message: "Missing userId query parameter" }, { status: 400 });
    }

    const userId = parseInt(userIdParam);

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid userId parameter" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error in /api/messages/load GET:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
