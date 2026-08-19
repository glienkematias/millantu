import Link from "next/link";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  material?: "ORO" | "PLATA" | null;
  slug: string;
}

interface CategorySectionProps {
  categoryName: string;
  categorySlug: string;
  products: Product[];
  whatsappNumber?: string;
  hidePrice?: boolean;
  hideWhatsApp?: boolean;
}

export default function CategorySection({
  categoryName,
  categorySlug,
  products,
  whatsappNumber,
  hidePrice = false,
  hideWhatsApp = false,
}: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-warm-brown-dark">
            {categoryName}
          </h2>
          <Link
            href={`/catalog?category=${categorySlug}`}
            className="font-lato text-sm font-medium text-champagne-dark hover:text-champagne transition-colors py-2 min-h-[44px] flex items-center"
          >
            Ver todos &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl}
              material={product.material}
              whatsappNumber={whatsappNumber}
              hidePrice={hidePrice}
              hideWhatsApp={hideWhatsApp}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
