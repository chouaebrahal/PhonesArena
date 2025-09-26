import { NextResponse } from "next/server";
import { SignupSchema } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedFields = SignupSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid fields!" }, { status: 400 });
    }

    const { fullName, email, password } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use!" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = `${fullName.toLowerCase().replace(/\s/g, "")}${Math.floor(1000 + Math.random() * 9000)}`;

    await prisma.user.create({
      data: {
        name: fullName,
        username:username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ success: "User created!" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
