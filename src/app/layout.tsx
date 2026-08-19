import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { prisma } from "@/lib/db";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Millantu Cosméticos",
  description:
    "Belleza que te hace brillar. Descubrí nuestra selección de cosméticos, fragancias y accesorios premium en Millantu Cosméticos.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  return (
    <html lang="es" className={`${playfair.variable} ${lato.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton
          phone={settings?.whatsappNumber ?? "+5491155551234"}
          message={settings?.whatsappMessage ?? "Hola! Me gustaría recibir más información."}
        />
      </body>
    </html>
  );
}
