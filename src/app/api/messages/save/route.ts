import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, messageText, messageType, severity } = body;

    if (!userId || !messageText || !messageType || severity === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: { userId, messageText, messageType, severity },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error in /api/messages/save POST:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
