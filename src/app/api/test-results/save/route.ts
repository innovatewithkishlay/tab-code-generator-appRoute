import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, stage, resultStatus, details } = body;

    if (!userId || stage === undefined || !resultStatus || !details) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const testResult = await prisma.testResult.create({
      data: { userId, stage, resultStatus, details },
    });

    return NextResponse.json(testResult);
  } catch (error) {
    console.error("Error in /api/test-results/save POST:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
