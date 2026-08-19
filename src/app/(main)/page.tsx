import { prisma } from "@/lib/db";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import ContactSection from "@/components/ContactSection";
import Link from "next/link";

export default async function Home() {
  const [settings, categories, products] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.category.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { products: { where: { active: true } } } },
      },
    }),
    prisma.product.findMany({
      where: { active: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const heroTitle = settings?.heroTitle ?? "Belleza que te hace brillar";
  const heroSubtitle =
    settings?.heroSubtitle ??
    "Descubrí nuestra selección de cosméticos, fragancias y accesorios premium.";
  const brandDescription =
    settings?.brandDescription ??
    "En Millantu Cosméticos creemos que cada persona merece sentirse única y hermosa. Ofrecemos productos de alta calidad seleccionados con amor para realzar tu belleza natural.";
  const whatsappNumber = settings?.whatsappNumber ?? "+5491155551234";

  const categoryIcons: Record<string, string> = {
    "cuidados-de-la-piel": "/images/categories/crema.jpeg",
    fragancias: "/images/categories/perfume.jpeg",
    maquillajes: "/images/categories/labial.jpeg",
    joyeria: "/images/categories/anillo.svg",
  };

  return (
    <div>
      <Hero title={heroTitle} subtitle={heroSubtitle} />

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-warm-brown-dark text-center mb-12">
            Nuestras Categorías
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat: { id: string; slug: string; name: string; _count: { products: number } }) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="group bg-cream rounded-2xl p-6 lg:p-8 text-center hover:bg-champagne hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <img
                  src={categoryIcons[cat.slug] ?? ""}
                  alt={cat.name}
                  className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="font-playfair text-lg font-semibold text-warm-brown-dark group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <p className="font-lato text-xs text-warm-gray group-hover:text-white/80 mt-1 transition-colors">
                  {cat._count.products} productos
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {categories.map((cat: { id: string; name: string; slug: string }) => {
        const catProducts = products
          .filter((p: { categoryId: string }) => p.categoryId === cat.id)
          .slice(0, 4)
          .map((p: { id: string; name: string; description: string | null; price: number; imageUrl: string | null; material: "ORO" | "PLATA" | null; slug: string }) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            imageUrl: p.imageUrl,
            material: p.material,
            slug: p.slug,
          }));

        return (
          <CategorySection
            key={cat.id}
            categoryName={cat.name}
            categorySlug={cat.slug}
            products={catProducts}
            whatsappNumber={whatsappNumber}
            hidePrice
            hideWhatsApp
          />
        );
      })}

      <section className="py-16 lg:py-24 bg-gradient-to-b from-cream-dark to-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-warm-brown-dark mb-6">
            Sobre Millantu
          </h2>
          <p className="font-lato text-lg text-warm-gray leading-relaxed max-w-3xl mx-auto">
            {brandDescription}
          </p>
          <div className="mt-10">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-champagne hover:bg-champagne-dark text-white font-lato font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Explorar productos
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
