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

    const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    if (hasToken) {
      const { put } = await import("@vercel/blob");
      const blob = await put(filename, file, { access: "public" });
      return NextResponse.json({ url: blob.url });
    }

    return NextResponse.json(
      { error: "Blob token not configured", hasToken, envKeys: Object.keys(process.env).filter(k => k.includes("BLOB")) },
      { status: 500 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: String(e) },
      { status: 500 }
    );
  }
}
