import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return payload;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó archivo" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mime = file.type || "image/jpeg";
    return NextResponse.json({ url: `data:${mime};base64,${base64}` });
  } catch (e) {
    return NextResponse.json(
      { error: String(e) },
      { status: 500 }
    );
  }
}
