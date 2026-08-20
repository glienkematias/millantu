"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import type { PublicProduct } from "@/lib/types";

const categoryOptions = [
  { label: "Todas", value: "" },
  { label: "Cuidados de la Piel", value: "cuidados-de-la-piel" },
  { label: "Fragancias", value: "fragancias" },
  { label: "Maquillajes", value: "maquillajes" },
  { label: "Joyería", value: "joyeria" },
];

const subcategoryMap: Record<string, { label: string; value: string }[]> = {
  "cuidados-de-la-piel": [
    { label: "Todas", value: "" },
    { label: "Limpieza facial", value: "limpieza-facial" },
    { label: "Cremas", value: "cremas" },
    { label: "Sérums", value: "serums" },
    { label: "Mascarillas", value: "mascarillas" },
    { label: "Cuidado corporal", value: "cuidado-corporal" },
    { label: "Protección solar", value: "proteccion-solar" },
  ],
  fragancias: [
    { label: "Todas", value: "" },
    { label: "Perfumes", value: "perfumes" },
    { label: "Body splash", value: "body-splash" },
    { label: "Perfumes femeninos", value: "perfumes-femeninos" },
    { label: "Perfumes masculinos", value: "perfumes-masculinos" },
    { label: "Sets de fragancias", value: "sets-de-fragancias" },
  ],
  maquillajes: [
    { label: "Todas", value: "" },
    { label: "Rostro", value: "rostro" },
    { label: "Ojos", value: "ojos" },
    { label: "Labios", value: "labios" },
    { label: "Bases", value: "bases" },
    { label: "Correctores", value: "correctores" },
    { label: "Rubores", value: "rubores" },
    { label: "Máscaras de pestañas", value: "mascaras-de-pestanas" },
  ],
  joyeria: [
    { label: "Todas", value: "" },
    { label: "Cadenas", value: "cadenas" },
    { label: "Dijes", value: "dijes" },
    { label: "Pulseras", value: "pulseras" },
    { label: "Anillos", value: "anillos" },
    { label: "Aros", value: "aros" },
    { label: "Conjuntos", value: "conjuntos" },
  ],
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("+5491155551234");
  const [whatsappMessage, setWhatsappMessage] = useState("Hola! Quisiera consultar por el producto");

  const category = searchParams.get("category") ?? "";
  const subcategory = searchParams.get("subcategory") ?? "";
  const search = searchParams.get("search") ?? "";
  const material = searchParams.get("material") ?? "";

  const [localSearch, setLocalSearch] = useState(search);

  const buildUrl = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams();
      const merged = { category, subcategory, search, material, ...updates };
      Object.entries(merged).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      return `/catalog?${params.toString()}`;
    },
    [category, subcategory, search, material]
  );

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
        if (data.whatsappMessage) setWhatsappMessage(data.whatsappMessage);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    if (search) params.set("search", search);
    if (material) params.set("material", material);
    params.set("active", "true");

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, subcategory, search, material]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl({ search: localSearch }));
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-warm-brown-dark mb-8">
          Catálogo
        </h1>

        <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-lato text-xs font-medium text-warm-gray mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value;
                  router.push(buildUrl({ category: val, subcategory: "", material: "" }));
                }}
                className="w-full border border-beige rounded-lg px-3 py-2.5 font-lato text-sm text-warm-brown-dark bg-white"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {category === "joyeria" && (
              <div>
                <label className="block font-lato text-xs font-medium text-warm-gray mb-1">
                  Material
                </label>
                <select
                  value={material}
                  onChange={(e) => {
                    const val = e.target.value;
                    router.push(buildUrl({ material: val }));
                  }}
                  className="w-full border border-beige rounded-lg px-3 py-2.5 font-lato text-sm text-warm-brown-dark bg-white"
                >
                  <option value="">Todos</option>
                  <option value="ORO">Folheado oro 18k</option>
                  <option value="PLATA">Folheado plata 925</option>
                </select>
              </div>
            )}

            <div>
              <label className="block font-lato text-xs font-medium text-warm-gray mb-1">
                {category === "joyeria" ? "Tipo" : "Subcategoría"}
              </label>
              <select
                value={subcategory}
                onChange={(e) => {
                  const val = e.target.value;
                  router.push(buildUrl({ subcategory: val }));
                }}
                className="w-full border border-beige rounded-lg px-3 py-2.5 font-lato text-sm text-warm-brown-dark bg-white"
                disabled={!category}
              >
                {category && subcategoryMap[category] ? (
                  subcategoryMap[category].map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))
                ) : (
                  <option value="">Seleccioná una categoría</option>
                )}
              </select>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-end">
              <div className="flex w-full">
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Buscar productos..."
                  className="flex-1 border border-beige rounded-l-lg px-3 py-2.5 font-lato text-sm text-warm-brown-dark bg-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-champagne text-white rounded-r-lg hover:bg-champagne-dark transition-colors font-lato text-sm min-h-[44px]"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="font-lato text-warm-gray">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-lato text-warm-gray text-lg">
              No se encontraron productos con esos filtros.
            </p>
          </div>
        ) : (
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
                whatsappMessage={whatsappMessage}
                hidePrice
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-cream min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-warm-brown-dark mb-8">
              Catálogo
            </h1>
            <div className="text-center py-20">
              <p className="font-lato text-warm-gray">Cargando productos...</p>
            </div>
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
