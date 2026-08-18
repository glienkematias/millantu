import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return payload;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;

    const subcategories = await prisma.subcategory.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(subcategories);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener subcategorías" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, categoryId, order } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Nombre y categoría son requeridos" },
        { status: 400 }
      );
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        slug: slug || toSlug(name),
        description: description || null,
        categoryId,
        order: order || 0,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json(subcategory, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear subcategoría" },
      { status: 500 }
    );
  }
}
