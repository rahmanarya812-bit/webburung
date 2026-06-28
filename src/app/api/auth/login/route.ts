import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === "admin" && password === "admin123") {
      const cookieStore = await cookies();
      cookieStore.set("user_session", "admin", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
      });
      return NextResponse.json({ success: true, role: "admin", name: "Administrator" });
    } else if (username === "user" && password === "user123") {
      const cookieStore = await cookies();
      cookieStore.set("user_session", "user", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
      });
      return NextResponse.json({ success: true, role: "user", name: "Exotic Bird Enthusiast" });
    }

    return NextResponse.json(
      { success: false, message: "Username atau password salah!" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}
