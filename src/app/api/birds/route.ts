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

export async function GET() {
  try {
    const birds = await readBirds();
    return NextResponse.json(birds);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memuat data burung." },
      { status: 500 }
    );
  }
}

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

    const { name, scientificName, origin, rarity, description, price, imageUrl } = await request.json();

    if (!name || !scientificName || !origin || !rarity || !description || !price) {
      return NextResponse.json(
        { success: false, message: "Semua field harus diisi." },
        { status: 400 }
      );
    }

    const birds = await readBirds();
    const newBird = {
      id: Date.now().toString(),
      name,
      scientificName,
      origin,
      rarity,
      description,
      price,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&auto=format&fit=crop&q=80",
    };

    birds.push(newBird);
    await writeBirds(birds);

    return NextResponse.json({ success: true, bird: newBird });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan burung." },
      { status: 500 }
    );
  }
}
