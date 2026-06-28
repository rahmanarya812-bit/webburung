import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    // Autentikasi dan Otorisasi Role Admin
    const cookieStore = await cookies();
    const session = cookieStore.get("user_session")?.value;

    if (session !== "admin") {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Anda bukan Admin." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Tidak ada file yang diunggah." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Pastikan folder public/uploads ada
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate nama file unik
    const fileExtension = path.extname(file.name) || ".jpg";
    const fileName = `bird_${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Tulis file ke direktori public/uploads
    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengunggah file." },
      { status: 500 }
    );
  }
}
