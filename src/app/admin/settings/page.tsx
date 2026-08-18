"use client";

import { useState, useEffect, FormEvent } from "react";

interface Settings {
  id: string;
  storeName: string;
  logo: string | null;
  whatsappNumber: string;
  whatsappMessage: string;
  instagram: string;
  facebook: string;
  email: string;
  heroTitle: string;
  heroSubtitle: string;
  brandDescription: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setSettings(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (field: keyof Settings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...settings, logo: data.url });
      } else {
        setError("Error al subir logo");
      }
    } catch {
      setError("Error al subir logo");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccess("Configuración guardada");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Error al guardar");
      }
    } catch {
      setError("Error de conexión");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return <p className="text-warm-gray text-sm">Error al cargar configuración</p>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-warm-brown-dark">Configuración</h1>
        <p className="text-sm text-warm-gray mt-1">Datos de tu tienda</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-beige p-6 space-y-6">
        {error && <div className="bg-error/10 text-error text-sm px-4 py-3 rounded-lg">{error}</div>}
        {success && <div className="bg-success/10 text-success text-sm px-4 py-3 rounded-lg">{success}</div>}

        {/* Store info */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-warm-brown-dark border-b border-beige pb-2">Tienda</h3>

          <div>
            <label className="block text-sm text-warm-gray mb-1.5">Nombre de la tienda</label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => update("storeName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-sm text-warm-gray mb-1.5">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full text-sm text-warm-gray file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-champagne file:text-white hover:file:bg-champagne-dark file:cursor-pointer"
            />
            {uploading && <p className="text-xs text-warm-gray mt-1">Subiendo...</p>}
            {settings.logo && (
              <div className="mt-3 relative w-20 h-20 rounded-lg overflow-hidden border border-beige">
                <img src={settings.logo} alt="Logo" className="w-full h-full object-contain bg-white" />
                <button
                  type="button"
                  onClick={() => update("logo", "")}
                  className="absolute top-1 right-1 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center text-xs"
                >
                  x
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-warm-brown-dark border-b border-beige pb-2">Contacto</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-warm-gray mb-1.5">WhatsApp número</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => update("whatsappNumber", e.target.value)}
                placeholder="+54 9 11 1234-5678"
                className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-gray mb-1.5">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="info@millantu.com"
                className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-warm-gray mb-1.5">Mensaje de WhatsApp</label>
            <input
              type="text"
              value={settings.whatsappMessage}
              onChange={(e) => update("whatsappMessage", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-warm-gray mb-1.5">Instagram</label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => update("instagram", e.target.value)}
                placeholder="@millantu"
                className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-gray mb-1.5">Facebook</label>
              <input
                type="text"
                value={settings.facebook}
                onChange={(e) => update("facebook", e.target.value)}
                placeholder="https://facebook.com/millantu"
                className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-warm-brown-dark border-b border-beige pb-2">Contenido</h3>

          <div>
            <label className="block text-sm text-warm-gray mb-1.5">Título hero</label>
            <input
              type="text"
              value={settings.heroTitle}
              onChange={(e) => update("heroTitle", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-sm text-warm-gray mb-1.5">Subtítulo hero</label>
            <textarea
              value={settings.heroSubtitle}
              onChange={(e) => update("heroSubtitle", e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-warm-gray mb-1.5">Descripción de la marca</label>
            <textarea
              value={settings.brandDescription}
              onChange={(e) => update("brandDescription", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-beige text-sm text-warm-brown-dark bg-cream/30 focus:border-champagne resize-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-champagne hover:bg-champagne-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar configuración"}
          </button>
        </div>
      </form>
    </div>
  );
}
