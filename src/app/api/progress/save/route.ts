import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, currentStage, progressData, timerState } = data;

    // Validate all required fields are present
    if (!userId || currentStage === undefined || !progressData || !timerState) {
      return NextResponse.json(
        { message: "Missing one or more required fields" },
        { status: 400 }
      );
    }

    // Upsert user's progress information
    const progress = await prisma.userProgress.upsert({
      where: { userId },
      update: {
        currentStage,
        progressData,
        timerState,
      },
      create: {
        userId,
        currentStage,
        progressData,
        timerState,
      },
    });

    return NextResponse.json(progress);
  } catch (err) {
    console.error("POST /api/progress/save error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
