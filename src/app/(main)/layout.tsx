import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton
        phone={settings?.whatsappNumber ?? "+5491155551234"}
        message={settings?.whatsappMessage ?? "Hola! Me gustaría recibir más información."}
      />
    </>
  );
}
