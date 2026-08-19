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

    if (hasToken) {
      try {
        const { put } = await import("@vercel/blob");
        const blob = await put(file.name, file, {
          access: "public",
        });
        return NextResponse.json({ url: blob.url });
      } catch (blobError) {
        return NextResponse.json(
          { error: "Blob upload failed", detail: String(blobError), hasToken },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "No blob token configured", hasToken },
      { status: 500 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: String(e) },
      { status: 500 }
    );
  }
}
