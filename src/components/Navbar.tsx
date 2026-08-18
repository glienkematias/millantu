"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface SubcategoryItem {
  name: string;
  slug: string;
}

interface CategoryItem {
  name: string;
  slug: string;
  subcategories: SubcategoryItem[];
}

const categories: CategoryItem[] = [
  {
    name: "Cuidados de la Piel",
    slug: "cuidados-de-la-piel",
    subcategories: [
      { name: "Limpieza facial", slug: "limpieza-facial" },
      { name: "Cremas", slug: "cremas" },
      { name: "Sérums", slug: "serums" },
      { name: "Mascarillas", slug: "mascarillas" },
      { name: "Cuidado corporal", slug: "cuidado-corporal" },
      { name: "Protección solar", slug: "proteccion-solar" },
    ],
  },
  {
    name: "Fragancias",
    slug: "fragancias",
    subcategories: [
      { name: "Perfumes", slug: "perfumes" },
      { name: "Body splash", slug: "body-splash" },
      { name: "Perfumes femeninos", slug: "perfumes-femeninos" },
      { name: "Perfumes masculinos", slug: "perfumes-masculinos" },
      { name: "Sets de fragancias", slug: "sets-de-fragancias" },
    ],
  },
  {
    name: "Maquillajes",
    slug: "maquillajes",
    subcategories: [
      { name: "Rostro", slug: "rostro" },
      { name: "Ojos", slug: "ojos" },
      { name: "Labios", slug: "labios" },
      { name: "Bases", slug: "bases" },
      { name: "Correctores", slug: "correctores" },
      { name: "Rubores", slug: "rubores" },
      { name: "Máscaras de pestañas", slug: "mascaras-de-pestanas" },
    ],
  },
  {
    name: "Joyería",
    slug: "joyeria",
    subcategories: [
      { name: "Collares", slug: "collares" },
      { name: "Pulseras", slug: "pulseras" },
      { name: "Aros", slug: "aros" },
      { name: "Anillos", slug: "anillos" },
      { name: "Sets", slug: "sets" },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((slug: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(slug);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-md shadow-sm"
          : "bg-cream"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="font-playfair text-xl lg:text-2xl font-bold text-warm-brown-dark tracking-tight">
            Millantu Cosméticos
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-lato font-medium text-warm-brown hover:text-champagne-dark transition-colors">
              Inicio
            </Link>
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => handleMouseEnter(cat.slug)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/catalog?category=${cat.slug}`}
                  className="text-sm font-lato font-medium text-warm-brown hover:text-champagne-dark transition-colors"
                >
                  {cat.name}
                </Link>
                {openDropdown === cat.slug && (
                  <div
                    className="absolute top-full left-0 pt-2"
                    onMouseEnter={() => handleMouseEnter(cat.slug)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="bg-white rounded-lg shadow-lg border border-beige py-2 min-w-[200px] animate-slide-down">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/catalog?category=${cat.slug}&subcategory=${sub.slug}`}
                          className="block px-4 py-2 text-sm font-lato text-warm-brown hover:bg-cream-dark hover:text-champagne-dark transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <a href="#contact" className="text-sm font-lato font-medium text-warm-brown hover:text-champagne-dark transition-colors">
              Contacto
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-warm-brown transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-warm-brown transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-warm-brown transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-beige animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-lato font-medium text-warm-brown py-2"
            >
              Inicio
            </Link>
            {categories.map((cat) => (
              <div key={cat.slug}>
                <Link
                  href={`/catalog?category=${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-lato font-medium text-warm-brown py-2"
                >
                  {cat.name}
                </Link>
                <div className="pl-4 space-y-1">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/catalog?category=${cat.slug}&subcategory=${sub.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block text-xs font-lato text-warm-gray py-1 hover:text-champagne-dark transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-lato font-medium text-warm-brown py-2"
            >
              Contacto
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
