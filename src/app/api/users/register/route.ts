import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import bcrypt from "bcryptjs"

export const POST = async (req: Request) => {
  try {
    const { name, email, password, avatarBase64 } = await req.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload avatar to Cloudinary
    const result = await cloudinary.uploader.upload(avatarBase64, {
      folder: "users",
    });

    // Save user in MongoDB via Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar: result.secure_url,
      },
    });

    // Return user data (you can omit password in frontend later)
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Registration failed" }), { status: 500 });
  }
};
