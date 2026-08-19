import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${playfair.variable} ${lato.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
