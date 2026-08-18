"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  active: boolean;
  imageUrl: string | null;
  createdAt: string;
  category: { id: string; name: string; slug: string };
}

interface Category {
  id: string;
  _count: { products: number };
}

interface Stats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalCategories: number;
}

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("es-AR", { minimumFractionDigits: 0 });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, activeProducts: 0, inactiveProducts: 0, totalCategories: 0 });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?active=true&limit=100").then((r) => r.json()),
      fetch("/api/products?active=false&limit=100").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/products?limit=5").then((r) => r.json()),
    ])
      .then(([active, inactive, categories, recent]: [Product[], Product[], Category[], Product[]]) => {
        const activeArr = Array.isArray(active) ? active : [];
        const inactiveArr = Array.isArray(inactive) ? inactive : [];
        const catArr = Array.isArray(categories) ? categories : [];
        const recentArr = Array.isArray(recent) ? recent : [];
        setStats({
          totalProducts: activeArr.length + inactiveArr.length,
          activeProducts: activeArr.length,
          inactiveProducts: inactiveArr.length,
          totalCategories: catArr.length,
        });
        setRecentProducts(recentArr.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Total productos", value: stats.totalProducts, color: "bg-champagne/10 text-champagne-dark" },
    { label: "Activos", value: stats.activeProducts, color: "bg-success/10 text-success" },
    { label: "Inactivos", value: stats.inactiveProducts, color: "bg-beige text-warm-gray" },
    { label: "Categorías", value: stats.totalCategories, color: "bg-nude/10 text-nude-dark" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-warm-brown-dark">Dashboard</h1>
        <p className="text-sm text-warm-gray mt-1">Resumen de tu tienda</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-beige p-5">
            <p className="text-xs text-warm-gray uppercase tracking-wide">{card.label}</p>
            <p className={`text-2xl font-semibold mt-2 ${card.color.split(" ")[1]}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-beige">
          <div className="px-6 py-4 border-b border-beige flex items-center justify-between">
            <h2 className="font-medium text-warm-brown-dark">Productos recientes</h2>
            <Link href="/admin/products" className="text-sm text-champagne hover:text-champagne-dark transition-colors">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-beige/60">
            {recentProducts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-warm-gray text-center">No hay productos</p>
            ) : (
              recentProducts.map((p) => (
                <div key={p.id} className="px-6 py-3 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center overflow-hidden shrink-0">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-5 h-5 text-warm-gray-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-warm-brown-dark truncate">{p.name}</p>
                    <p className="text-xs text-warm-gray">{p.category.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-warm-brown-dark">{formatPrice(p.price)}</p>
                    <span className={`text-xs ${p.active ? "text-success" : "text-warm-gray"}`}>
                      {p.active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-beige p-6">
          <h2 className="font-medium text-warm-brown-dark mb-4">Acciones rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/admin/products/new"
              className="block w-full text-center py-2.5 bg-champagne hover:bg-champagne-dark text-white rounded-lg text-sm font-medium transition-colors"
            >
              Nuevo producto
            </Link>
            <Link
              href="/admin/categories"
              className="block w-full text-center py-2.5 bg-cream hover:bg-beige text-warm-brown-dark rounded-lg text-sm font-medium transition-colors border border-beige"
            >
              Gestionar categorías
            </Link>
            <Link
              href="/admin/settings"
              className="block w-full text-center py-2.5 bg-cream hover:bg-beige text-warm-brown-dark rounded-lg text-sm font-medium transition-colors border border-beige"
            >
              Configuración
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
