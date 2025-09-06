import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, feedbackText, rating } = body;

    if (!userId || !feedbackText || rating === undefined) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: { userId, feedbackText, rating },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error in /api/feedback/submit POST:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
