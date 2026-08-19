export interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  active: boolean;
  material: "ORO" | "PLATA" | null;
  categoryId: string;
  subcategoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  order: number;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    active: boolean;
    order: number;
  }[];
  _count?: {
    products: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettingsData {
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

export type PublicProduct = Omit<ProductWithRelations, 'createdAt' | 'updatedAt'>;
export type PublicCategory = Omit<CategoryWithRelations, 'createdAt' | 'updatedAt'>;
