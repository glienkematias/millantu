"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [active, setActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const subcategories = selectedCategory?.subcategories || [];

  useEffect(() => {
    setSubcategoryId("");
  }, [categoryId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
      } else {
        setError("Error al subir imagen");
      }
    } catch {
      setError("Error al subir imagen");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) { setError("El nombre es requerido"); return; }
    if (!price || parseFloat(price) <= 0) { setError("El precio es requerido"); return; }
    if (!categoryId) { setError("La categoría es requerida"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          price: parseFloat(price),
          categoryId,
          subcategoryId: subcategoryId || null,
          imageUrl: imageUrl || null,
          active,
          slug: toSlug(name),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al crear producto");
        return;
      }

      setSuccess("Producto creado exitosamente");
      setTimeout(() => router.push("/admin/products"), 1000);
    } catch {
      setError("Error de conexión");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-champagne hover:text-champagne-dark transition-colors inline-flex items-center gap-1 mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Volver
        </Link>
        <h1 className="text-2xl font-semibold text-warm-brown-dark">Nuevo producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-beige p-6 space-y-5">
        {error && <div className="bg-error/10 text-error text-sm px-4 py-3 rounded-lg">{error}</div>}
        {success && <div className="bg-success/10 text-success text-sm px-4 py-3 rounded-lg">{success}</div>}

        <div>
          <label className="block text-sm text-warm-gray mb-1.5">Nombre *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
            placeholder="Nombre del producto"
          />
        </div>

        <div>
          <label className="block text-sm text-warm-gray mb-1.5">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne resize-none"
            placeholder="Descripción del producto"
          />
        </div>

        <div>
          <label className="block text-sm text-warm-gray mb-1.5">Precio *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-warm-gray mb-1.5">Categoría *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
            >
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-warm-gray mb-1.5">Subcategoría</label>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              disabled={!categoryId || subcategories.length === 0}
              className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne disabled:opacity-50"
            >
              <option value="">Ninguna</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-warm-gray mb-1.5">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm text-warm-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-champagne file:text-white hover:file:bg-champagne-dark file:cursor-pointer"
          />
          {uploading && <p className="text-xs text-warm-gray mt-1">Subiendo imagen...</p>}
          {imageUrl && (
            <div className="mt-3 relative w-24 h-24 rounded-lg overflow-hidden border border-beige">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-1 right-1 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center text-xs"
              >
                x
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActive(!active)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? "bg-champagne" : "bg-beige-dark"}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${active ? "translate-x-[22px]" : "translate-x-[4px]"}`} />
          </button>
          <span className="text-sm text-warm-gray">{active ? "Activo" : "Inactivo"}</span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-champagne hover:bg-champagne-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Crear producto"}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-2.5 bg-cream hover:bg-beige text-warm-brown-dark rounded-lg text-sm font-medium transition-colors border border-beige"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
