import fs from "fs/promises";
import path from "path";
import initialBirds from "@/data/birds.json";

// In-memory global cache for serverless environments (like Vercel) where filesystem is read-only
let birdsCache: any[] | null = null;

const getFilePath = () => path.join(process.cwd(), "src", "data", "birds.json");

export async function readBirds() {
  if (birdsCache !== null) {
    return birdsCache;
  }
  
  const filePath = getFilePath();
  try {
    const data = await fs.readFile(filePath, "utf-8");
    birdsCache = JSON.parse(data);
    return birdsCache || [];
  } catch (error) {
    birdsCache = [...initialBirds];
    return birdsCache;
  }
}

export async function writeBirds(birds: any[]) {
  birdsCache = birds;
  const filePath = getFilePath();
  try {
    await fs.writeFile(filePath, JSON.stringify(birds, null, 2), "utf-8");
  } catch (error) {
    console.warn("Failed to write to filesystem (expected on read-only serverless environments like Vercel). Using in-memory fallback.");
  }
}
