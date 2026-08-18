"use client";

import { useState, useEffect, FormEvent } from "react";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  order: number;
  _count: { products: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  order: number;
  subcategories: Subcategory[];
  _count: { products: number };
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catSaving, setCatSaving] = useState(false);
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatSlug, setEditCatSlug] = useState("");

  const [subName, setSubName] = useState("");
  const [subSlug, setSubSlug] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subSaving, setSubSaving] = useState(false);
  const [editingSub, setEditingSub] = useState<string | null>(null);
  const [editSubName, setEditSubName] = useState("");
  const [editSubSlug, setEditSubSlug] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showMessage = (msg: string, isError = false) => {
    if (isError) setError(msg); else setSuccess(msg);
    setTimeout(() => { setError(""); setSuccess(""); }, 3000);
  };

  const addCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) { showMessage("El nombre es requerido", true); return; }
    setCatSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName.trim(), slug: catSlug || toSlug(catName) }),
      });
      if (res.ok) {
        setCatName(""); setCatSlug("");
        fetchCategories();
        showMessage("Categoría creada");
      } else {
        const data = await res.json();
        showMessage(data.error || "Error", true);
      }
    } catch { showMessage("Error de conexión", true); }
    setCatSaving(false);
  };

  const updateCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCatName, slug: editCatSlug || toSlug(editCatName) }),
      });
      if (res.ok) {
        setEditingCat(null);
        fetchCategories();
        showMessage("Categoría actualizada");
      }
    } catch {}
  };

  const toggleCategory = async (cat: Category) => {
    try {
      await fetch(`/api/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !cat.active }),
      });
      fetchCategories();
    } catch {}
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría? Los productos asociados perderán su categoría.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
        showMessage("Categoría eliminada");
      }
    } catch {}
  };

  const addSubcategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCategoryId) { showMessage("Nombre y categoría requeridos", true); return; }
    setSubSaving(true);
    try {
      const res = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subName.trim(), slug: subSlug || toSlug(subName), categoryId: subCategoryId }),
      });
      if (res.ok) {
        setSubName(""); setSubSlug(""); setSubCategoryId("");
        fetchCategories();
        showMessage("Subcategoría creada");
      } else {
        const data = await res.json();
        showMessage(data.error || "Error", true);
      }
    } catch { showMessage("Error de conexión", true); }
    setSubSaving(false);
  };

  const updateSubcategory = async (id: string) => {
    try {
      const res = await fetch(`/api/subcategories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editSubName, slug: editSubSlug || toSlug(editSubName) }),
      });
      if (res.ok) {
        setEditingSub(null);
        fetchCategories();
        showMessage("Subcategoría actualizada");
      }
    } catch {}
  };

  const toggleSubcategory = async (sub: Subcategory) => {
    try {
      await fetch(`/api/subcategories/${sub.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !sub.active }),
      });
      fetchCategories();
    } catch {}
  };

  const deleteSubcategory = async (id: string) => {
    if (!confirm("¿Eliminar esta subcategoría?")) return;
    try {
      const res = await fetch(`/api/subcategories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
        showMessage("Subcategoría eliminada");
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-warm-brown-dark">Categorías</h1>
        <p className="text-sm text-warm-gray mt-1">Gestioná tus categorías y subcategorías</p>
      </div>

      {error && <div className="bg-error/10 text-error text-sm px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="bg-success/10 text-success text-sm px-4 py-3 rounded-lg">{success}</div>}

      {/* New category form */}
      <div className="bg-white rounded-xl border border-beige p-6">
        <h2 className="font-medium text-warm-brown-dark mb-4">Nueva categoría</h2>
        <form onSubmit={addCategory} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="Nombre"
            className="flex-1 px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
          />
          <input
            type="text"
            value={catSlug}
            onChange={(e) => setCatSlug(e.target.value)}
            placeholder="Slug (auto)"
            className="w-full sm:w-40 px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
          />
          <button
            type="submit"
            disabled={catSaving}
            className="px-5 py-2.5 bg-champagne hover:bg-champagne-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
          >
            {catSaving ? "..." : "Crear"}
          </button>
        </form>
      </div>

      {/* New subcategory form */}
      <div className="bg-white rounded-xl border border-beige p-6">
        <h2 className="font-medium text-warm-brown-dark mb-4">Nueva subcategoría</h2>
        <form onSubmit={addSubcategory} className="flex flex-col sm:flex-row gap-3">
          <select
            value={subCategoryId}
            onChange={(e) => setSubCategoryId(e.target.value)}
            className="w-full sm:w-48 px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
          >
            <option value="">Categoría...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            placeholder="Nombre"
            className="flex-1 px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
          />
          <input
            type="text"
            value={subSlug}
            onChange={(e) => setSubSlug(e.target.value)}
            placeholder="Slug (auto)"
            className="w-full sm:w-40 px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
          />
          <button
            type="submit"
            disabled={subSaving}
            className="px-5 py-2.5 bg-champagne hover:bg-champagne-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
          >
            {subSaving ? "..." : "Crear"}
          </button>
        </form>
      </div>

      {/* Categories list */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <p className="text-sm text-warm-gray text-center py-8">No hay categorías</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-beige overflow-hidden">
              {/* Category header */}
              <div className="px-6 py-4 flex items-center gap-4">
                <button
                  onClick={() => toggleCategory(cat)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${cat.active ? "bg-champagne" : "bg-beige-dark"}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${cat.active ? "translate-x-[22px]" : "translate-x-[4px]"}`} />
                </button>

                <div className="flex-1 min-w-0">
                  {editingCat === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className="px-3 py-1 rounded border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne w-40"
                      />
                      <input
                        type="text"
                        value={editCatSlug}
                        onChange={(e) => setEditCatSlug(e.target.value)}
                        className="px-3 py-1 rounded border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne w-28"
                      />
                      <button onClick={() => updateCategory(cat.id)} className="text-xs text-success hover:underline">Guardar</button>
                      <button onClick={() => setEditingCat(null)} className="text-xs text-warm-gray hover:underline">Cancelar</button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-warm-brown-dark">{cat.name}</p>
                      <p className="text-xs text-warm-gray">/{cat.slug} · {cat._count.products} productos · {cat.subcategories.length} subcategorías</p>
                    </div>
                  )}
                </div>

                {editingCat !== cat.id && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => { setEditingCat(cat.id); setEditCatName(cat.name); setEditCatSlug(cat.slug); }}
                      className="p-1.5 rounded-lg text-warm-gray hover:text-champagne hover:bg-cream transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 rounded-lg text-warm-gray hover:text-error hover:bg-error/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Subcategories */}
              {cat.subcategories.length > 0 && (
                <div className="border-t border-beige/60 bg-cream/20">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.id} className="px-6 py-3 pl-14 flex items-center gap-3 border-b border-beige/30 last:border-b-0">
                      <button
                        onClick={() => toggleSubcategory(sub)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${sub.active ? "bg-champagne" : "bg-beige-dark"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${sub.active ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
                      </button>

                      <div className="flex-1 min-w-0">
                        {editingSub === sub.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editSubName}
                              onChange={(e) => setEditSubName(e.target.value)}
                              className="px-2 py-1 rounded border border-beige text-xs text-warm-brown-dark bg-white focus:border-champagne w-32"
                            />
                            <input
                              type="text"
                              value={editSubSlug}
                              onChange={(e) => setEditSubSlug(e.target.value)}
                              className="px-2 py-1 rounded border border-beige text-xs text-warm-brown-dark bg-white focus:border-champagne w-24"
                            />
                            <button onClick={() => updateSubcategory(sub.id)} className="text-xs text-success hover:underline">OK</button>
                            <button onClick={() => setEditingSub(null)} className="text-xs text-warm-gray hover:underline">X</button>
                          </div>
                        ) : (
                          <p className="text-xs text-warm-gray">
                            <span className="text-warm-brown-dark">{sub.name}</span>
                            {" "} · /{sub.slug} · {sub._count.products} productos
                          </p>
                        )}
                      </div>

                      {editingSub !== sub.id && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => { setEditingSub(sub.id); setEditSubName(sub.name); setEditSubSlug(sub.slug); }}
                            className="p-1 rounded text-warm-gray hover:text-champagne transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteSubcategory(sub.id)}
                            className="p-1 rounded text-warm-gray hover:text-error transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
