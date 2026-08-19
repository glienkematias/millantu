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
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const search = searchParams.get("search");
    const active = searchParams.get("active");
    const material = searchParams.get("material");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const limit = searchParams.get("limit");

    const where: Record<string, unknown> = {};

    if (active !== null) {
      where.active = active === "true";
    } else {
      where.active = true;
    }

    if (category) {
      where.category = { slug: category };
    }
    if (subcategory) {
      where.subcategory = { slug: subcategory };
    }
    if (material) {
      where.material = material as "ORO" | "PLATA";
    }
    if (search) {
      where.name = { contains: search };
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: parseInt(limit) } : {}),
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener productos" },
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
    const { name, description, price, categoryId, subcategoryId, imageUrl, active, slug, material } = body;

    if (!name || price === undefined || !categoryId) {
      return NextResponse.json(
        { error: "Nombre, precio y categoría son requeridos" },
        { status: 400 }
      );
    }

    const productSlug = slug || toSlug(name);

    const product = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        description: description || null,
        price: parseFloat(price),
        categoryId,
        subcategoryId: subcategoryId || null,
        imageUrl: imageUrl || null,
        active: active !== undefined ? active : true,
        material: material || null,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
