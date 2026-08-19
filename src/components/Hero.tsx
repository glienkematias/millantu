import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
}

export default function Hero({
  title = "Belleza que te hace brillar",
  subtitle = "Descubrí nuestra selección de cosméticos, fragancias y accesorios premium.",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream via-cream-dark to-beige">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-champagne rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-nude rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-champagne-dark rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-bold text-warm-brown-dark leading-tight mb-6">
            {title}
          </h1>
          <p className="font-lato text-base sm:text-lg lg:text-xl text-warm-gray mb-8 sm:mb-10 leading-relaxed">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-champagne hover:bg-champagne-dark text-white font-lato font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Ver productos
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-warm-brown text-warm-brown font-lato font-medium rounded-full hover:bg-warm-brown hover:text-white transition-all duration-300"
            >
              Contactanos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
