import "dotenv/config";
import { PrismaClient, Material } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("Millantu2024!", 12);

  await prisma.adminUser.upsert({
    where: { email: "admin@millantu.com" },
    update: {},
    create: {
      email: "admin@millantu.com",
      password: hashedPassword,
      name: "Admin Millantu",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "Millantu Cosméticos",
      whatsappNumber: "+5491155551234",
      whatsappMessage: "Hola! Quisiera consultar por el producto",
      instagram: "@millantucosmeticos",
      facebook: "MillantuCosmeticos",
      email: "info@millantu.com",
      heroTitle: "Belleza que te hace brillar",
      heroSubtitle: "Descubrí nuestra selección de cosméticos, fragancias y accesorios premium.",
      brandDescription: "En Millantu Cosméticos creemos que cada persona merece sentirse única y hermosa. Ofrecemos productos de alta calidad seleccionados con amor para realzar tu belleza natural.",
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "cuidados-de-la-piel" },
      update: {},
      create: {
        name: "Cuidados de la Piel",
        slug: "cuidados-de-la-piel",
        description: "Cuida tu piel con productos de alta calidad",
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "fragancias" },
      update: {},
      create: {
        name: "Fragancias",
        slug: "fragancias",
        description: "Aromas que definen tu esencia",
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "maquillajes" },
      update: {},
      create: {
        name: "Maquillajes",
        slug: "maquillajes",
        description: "Realza tu belleza con cada trazo",
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "joyeria" },
      update: {},
      create: {
        name: "Joyería",
        slug: "joyeria",
        description: "Accesorios que elevan tu estilo",
        order: 4,
      },
    }),
  ]);

  const [piel, fragancias, maquillajes, joyeria] = categories;

  await prisma.subcategory.deleteMany({
    where: {
      categoryId: joyeria.id,
      slug: { in: ["collares", "sets"] },
    },
  });

  const subcategoriesData: { name: string; slug: string; categoryId: string; order: number }[] = [
    { name: "Limpieza facial", slug: "limpieza-facial", categoryId: piel.id, order: 1 },
    { name: "Cremas", slug: "cremas", categoryId: piel.id, order: 2 },
    { name: "Sérums", slug: "serums", categoryId: piel.id, order: 3 },
    { name: "Mascarillas", slug: "mascarillas", categoryId: piel.id, order: 4 },
    { name: "Cuidado corporal", slug: "cuidado-corporal", categoryId: piel.id, order: 5 },
    { name: "Protección solar", slug: "proteccion-solar", categoryId: piel.id, order: 6 },

    { name: "Perfumes", slug: "perfumes", categoryId: fragancias.id, order: 1 },
    { name: "Body splash", slug: "body-splash", categoryId: fragancias.id, order: 2 },
    { name: "Perfumes femeninos", slug: "perfumes-femeninos", categoryId: fragancias.id, order: 3 },
    { name: "Perfumes masculinos", slug: "perfumes-masculinos", categoryId: fragancias.id, order: 4 },
    { name: "Sets de fragancias", slug: "sets-de-fragancias", categoryId: fragancias.id, order: 5 },

    { name: "Rostro", slug: "rostro", categoryId: maquillajes.id, order: 1 },
    { name: "Ojos", slug: "ojos", categoryId: maquillajes.id, order: 2 },
    { name: "Labios", slug: "labios", categoryId: maquillajes.id, order: 3 },
    { name: "Bases", slug: "bases", categoryId: maquillajes.id, order: 4 },
    { name: "Correctores", slug: "correctores", categoryId: maquillajes.id, order: 5 },
    { name: "Rubores", slug: "rubores", categoryId: maquillajes.id, order: 6 },
    { name: "Máscaras de pestañas", slug: "mascaras-de-pestanas", categoryId: maquillajes.id, order: 7 },

    { name: "Cadenas", slug: "cadenas", categoryId: joyeria.id, order: 1 },
    { name: "Dijes", slug: "dijes", categoryId: joyeria.id, order: 2 },
    { name: "Pulseras", slug: "pulseras", categoryId: joyeria.id, order: 3 },
    { name: "Anillos", slug: "anillos", categoryId: joyeria.id, order: 4 },
    { name: "Aros", slug: "aros", categoryId: joyeria.id, order: 5 },
    { name: "Conjuntos", slug: "conjuntos", categoryId: joyeria.id, order: 6 },
  ];

  const subcategories: Record<string, { id: string }> = {};

  for (const sub of subcategoriesData) {
    const created = await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: sub.categoryId, slug: sub.slug } },
      update: {},
      create: sub,
    });
    subcategories[sub.slug] = created;
  }

  const productsData: { name: string; slug: string; description: string; price: number; categoryId: string; subcategoryId: string; imageUrl: string | null; material?: Material }[] = [
    {
      name: "Limpiador Facial Suave",
      slug: "limpiador-facial-suave",
      description: "Gel limpiador con aloe vera que elimina impurezas sin resecar. Ideal para todo tipo de piel.",
      price: 4500,
      categoryId: piel.id,
      subcategoryId: subcategories["limpieza-facial"].id,
      imageUrl: null,
    },
    {
      name: "Crema Hidratante Nutritiva",
      slug: "crema-hidratante-nutritiva",
      description: "Crema enriquecida con aceite de argán y vitamina E. Hidrata profundamente durante 24 horas.",
      price: 8900,
      categoryId: piel.id,
      subcategoryId: subcategories["cremas"].id,
      imageUrl: null,
    },
    {
      name: "Sérum Vitamina C Brillantez",
      slug: "serum-vitamina-c",
      description: "Sérum concentrado con vitamina C pura. Ilumina, unifica el tono y protege contra radicales libres.",
      price: 12500,
      categoryId: piel.id,
      subcategoryId: subcategories["serums"].id,
      imageUrl: null,
    },
    {
      name: "Mascarilla de Arcilla Purificante",
      slug: "mascarilla-arcilla",
      description: "Mascarilla de arcilla verde con minerales. Limpia poros y controla la grasa sin irritar.",
      price: 6200,
      categoryId: piel.id,
      subcategoryId: subcategories["mascarillas"].id,
      imageUrl: null,
    },
    {
      name: "Body Butter Karité",
      slug: "body-butter-karite",
      description: "Butter corporal ultra nutritivo con manteca de karité. Deja la piel sedosa y perfumada.",
      price: 7800,
      categoryId: piel.id,
      subcategoryId: subcategories["cuidado-corporal"].id,
      imageUrl: null,
    },
    {
      name: "Protector Solar FPS 50",
      slug: "protector-solar-fps50",
      description: "Protector solar de amplio espectro con textura ligera. No deja residuos blancos.",
      price: 9500,
      categoryId: piel.id,
      subcategoryId: subcategories["proteccion-solar"].id,
      imageUrl: null,
    },
    {
      name: "Essence D'Rose",
      slug: "essence-d-rose",
      description: "Fragancia femenina con notas de rosa, peonía y almizcle. Elegancia en cada gota.",
      price: 18900,
      categoryId: fragancias.id,
      subcategoryId: subcategories["perfumes-femeninos"].id,
      imageUrl: null,
    },
    {
      name: "Noir Intense",
      slug: "noir-intense",
      description: "Fragancia masculina con notas de vetiver, cuero y pimienta negra. Para el hombre sofisticado.",
      price: 22500,
      categoryId: fragancias.id,
      subcategoryId: subcategories["perfumes-masculinos"].id,
      imageUrl: null,
    },
    {
      name: "Golden Blossom Body Splash",
      slug: "golden-blossom-body-splash",
      description: "Body splash fresco con notas de flor de azahar y frutas tropicales. Refrescante y duradero.",
      price: 5800,
      categoryId: fragancias.id,
      subcategoryId: subcategories["body-splash"].id,
      imageUrl: null,
    },
    {
      name: "Set Romantic Duo",
      slug: "set-romantic-duo",
      description: "Set que incluye Essence D'Rose y Noir Intense. El regalo perfecto para parejas.",
      price: 35900,
      categoryId: fragancias.id,
      subcategoryId: subcategories["sets-de-fragancias"].id,
      imageUrl: null,
    },
    {
      name: "Velvet Orchid",
      slug: "velvet-orchid",
      description: "Fragancia con notas de orquídea, vainilla y sándalo. Seducción y misterio.",
      price: 21000,
      categoryId: fragancias.id,
      subcategoryId: subcategories["perfumes-femeninos"].id,
      imageUrl: null,
    },
    {
      name: "Base Soft Matte",
      slug: "base-soft-matte",
      description: "Base de maquillaje de cobertura media con acabado mate natural. Fórmula ligera y resistente.",
      price: 11200,
      categoryId: maquillajes.id,
      subcategoryId: subcategories["bases"].id,
      imageUrl: null,
    },
    {
      name: "Paleta de Ojos Sunset",
      slug: "paleta-ojos-sunset",
      description: "Paleta de 12 tonos cálidos con acabados mates y shimmer. Del día a la noche.",
      price: 15600,
      categoryId: maquillajes.id,
      subcategoryId: subcategories["ojos"].id,
      imageUrl: null,
    },
    {
      name: "Labial Velvet Rose",
      slug: "labial-velvet-rose",
      description: "Labial de textura aterciopelada con color intenso. Fórmula hidratante que dura horas.",
      price: 5400,
      categoryId: maquillajes.id,
      subcategoryId: subcategories["labios"].id,
      imageUrl: null,
    },
    {
      name: "Corrector Luminoso",
      slug: "corrector-luminoso",
      description: "Corrector con microperlás que ilumina la mirada. Cubre ojeras y manchas sutilmente.",
      price: 7200,
      categoryId: maquillajes.id,
      subcategoryId: subcategories["correctores"].id,
      imageUrl: null,
    },
    {
      name: "Rubor Peach Glow",
      slug: "rubor-peach-glow",
      description: "Rubor en polvo con tono durazno que da un brillo saludable y natural.",
      price: 6800,
      categoryId: maquillajes.id,
      subcategoryId: subcategories["rubores"].id,
      imageUrl: null,
    },
    {
      name: "Máscara de Pestañas Volume Max",
      slug: "mascara-volume-max",
      description: "Máscara que da volumen y longitud extremas sin grumos. Fórmula a prueba de agua.",
      price: 6500,
      categoryId: maquillajes.id,
      subcategoryId: subcategories["mascaras-de-pestanas"].id,
      imageUrl: null,
    },
    {
      name: "Collar Rosa Eterna",
      slug: "collar-rosa-eterna",
      description: "Collar con dije de rosa en baño de oro. Cadena delicada y ajustable.",
      price: 8900,
      categoryId: joyeria.id,
      subcategoryId: subcategories["cadenas"].id,
      material: "ORO",
      imageUrl: null,
    },
    {
      name: "Pulsera Charm Bohemia",
      slug: "pulsera-charm-bohemia",
      description: "Pulsera con charms de conchas, estrellas y perlas. Estilo libre y femenino.",
      price: 6500,
      categoryId: joyeria.id,
      subcategoryId: subcategories["pulseras"].id,
      material: "PLATA",
      imageUrl: null,
    },
    {
      name: "Aros Cascada Dorada",
      slug: "aros-cascada-dorada",
      description: "Aros colgantes con diseño de cascada en baño de oro 18k. Ligeros y elegantes.",
      price: 7200,
      categoryId: joyeria.id,
      subcategoryId: subcategories["aros"].id,
      material: "ORO",
      imageUrl: null,
    },
    {
      name: "Anillo Solitaire Minimal",
      slug: "anillo-solitaire-minimal",
      description: "Anillo solitario con piedra de circonio. Diseño minimalista y atemporal.",
      price: 5800,
      categoryId: joyeria.id,
      subcategoryId: subcategories["anillos"].id,
      material: "PLATA",
      imageUrl: null,
    },
    {
      name: "Set Completo Luna",
      slug: "set-completo-luna",
      description: "Set que incluye collar, pulsera, aros y anillo con tema lunar. La colección completa.",
      price: 24900,
      categoryId: joyeria.id,
      subcategoryId: subcategories["conjuntos"].id,
      material: "ORO",
      imageUrl: null,
    },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        material: (product.material as Material) ?? null,
        subcategoryId: product.subcategoryId,
      },
      create: product,
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
