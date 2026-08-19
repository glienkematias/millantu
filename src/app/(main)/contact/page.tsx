import ContactSection from "@/components/ContactSection";

export const metadata = {
  title: "Contacto | Millantu Cosméticos",
  description: "Contactanos por WhatsApp para consultas, pedidos y asesoramiento personalizado.",
};

export default function ContactPage() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-warm-brown-dark mb-6">
          Contacto
        </h1>
        <p className="font-lato text-lg text-warm-gray mb-4 leading-relaxed">
          En Millantu Cosméticos nos encanta escucharte. Ya sea que tengas
          preguntas sobre nuestros productos, necesites asesoramiento personalizado
          o quieras hacer un pedido, estamos para ayudarte.
        </p>
        <p className="font-lato text-warm-gray mb-10">
          La forma más rápida de comunicarte con nosotros es por WhatsApp.
        </p>
      </div>
      <ContactSection />
    </div>
  );
}
