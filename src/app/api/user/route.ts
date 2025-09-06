import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, studentNumber } = body;

    if (!name || !studentNumber) {
      return NextResponse.json({ message: "Name and studentNumber are required" }, { status: 400 });
    }

    let user = await prisma.user.findFirst({
      where: { studentNumber: String(studentNumber) },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { name, studentNumber },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in /api/user POST:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
