import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const getFilePath = () => path.join(process.cwd(), "src/data/birds.json");

async function readBirds() {
  const filePath = getFilePath();
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeBirds(birds: any[]) {
  const filePath = getFilePath();
  await fs.writeFile(filePath, JSON.stringify(birds, null, 2), "utf-8");
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const birds = await readBirds();
    const updatedBirds = birds.filter((bird: any) => bird.id !== id);

    if (birds.length === updatedBirds.length) {
      return NextResponse.json(
        { success: false, message: "Burung tidak ditemukan." },
        { status: 404 }
      );
    }

    await writeBirds(updatedBirds);
    return NextResponse.json({ success: true, message: "Burung berhasil dihapus." });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus burung." },
      { status: 500 }
    );
  }
}
