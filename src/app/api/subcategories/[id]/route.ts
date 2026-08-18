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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const existing = await prisma.subcategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Subcategoría no encontrada" },
        { status: 404 }
      );
    }

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    else if (body.name !== undefined) data.slug = toSlug(body.name);
    if (body.description !== undefined) data.description = body.description || null;
    if (body.active !== undefined) data.active = body.active;
    if (body.order !== undefined) data.order = body.order;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;

    const subcategory = await prisma.subcategory.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json(subcategory);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar subcategoría" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.subcategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Subcategoría no encontrada" },
        { status: 404 }
      );
    }

    await prisma.subcategory.delete({ where: { id } });

    return NextResponse.json({ message: "Subcategoría eliminada" });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar subcategoría" },
      { status: 500 }
    );
  }
}
