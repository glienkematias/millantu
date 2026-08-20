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
      { name: "Folheado oro 18k", slug: "joyeria-oro" },
      { name: "Folheado plata 925", slug: "joyeria-plata" },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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
                      {cat.subcategories.map((sub) => {
                        const href = sub.slug.startsWith("joyeria-")
                          ? `/catalog?category=${cat.slug}&material=${sub.slug === "joyeria-oro" ? "ORO" : "PLATA"}`
                          : `/catalog?category=${cat.slug}&subcategory=${sub.slug}`;
                        return (
                          <Link
                            key={sub.slug}
                            href={href}
                            className="block px-4 py-2 text-sm font-lato text-warm-brown hover:bg-cream-dark hover:text-champagne-dark transition-colors"
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link href="/contact" className="text-sm font-lato font-medium text-warm-brown hover:text-champagne-dark transition-colors">
              Contacto
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 w-11 h-11 items-center justify-center"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-warm-brown transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-warm-brown transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-warm-brown transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-beige animate-slide-down max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-lato font-medium text-warm-brown py-3 min-h-[44px] flex items-center"
            >
              Inicio
            </Link>
            {categories.map((cat) => (
              <div key={cat.slug}>
                <div className="flex items-center">
                  <Link
                    href={`/catalog?category=${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-sm font-lato font-medium text-warm-brown py-3 min-h-[44px] flex items-center"
                  >
                    {cat.name}
                  </Link>
                  <button
                    onClick={() => setMobileAccordion(mobileAccordion === cat.slug ? null : cat.slug)}
                    className="w-11 h-11 flex items-center justify-center"
                    aria-label={`Expandir ${cat.name}`}
                  >
                    <svg
                      className={`w-4 h-4 text-warm-gray transition-transform duration-200 ${mobileAccordion === cat.slug ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {mobileAccordion === cat.slug && (
                  <div className="pl-4 pb-2">
                    {cat.subcategories.map((sub) => {
                      const href = sub.slug.startsWith("joyeria-")
                        ? `/catalog?category=${cat.slug}&material=${sub.slug === "joyeria-oro" ? "ORO" : "PLATA"}`
                        : `/catalog?category=${cat.slug}&subcategory=${sub.slug}`;
                      return (
                        <Link
                          key={sub.slug}
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className="block text-sm font-lato text-warm-gray py-2.5 min-h-[44px] flex items-center hover:text-champagne-dark transition-colors"
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-lato font-medium text-warm-brown py-3 min-h-[44px] flex items-center"
            >
              Contacto
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
