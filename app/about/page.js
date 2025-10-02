// app/about/page.js
import AboutContent from '@/components/AboutContent';

export const metadata = {
  title: 'Nosotros | Atl Ecosystem',
  description:
    'Más de 12 años diseñando, construyendo y cuidando Estanques, BioPiscinas y Ecosistemas Acuáticos.',
};

export default function AboutPage() {
  return (
    // Más separación del navbar fijo (ajusta si tu barra es más alta)
    <main className="relative min-h-dvh pt-28 md:pt-32 lg:pt-36">
      {/* Fondo de video + overlay, fijados detrás del contenido */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          aria-hidden
        >
          <source src="/estanque.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-black/55" aria-hidden />
      </div>

      <AboutContent />
    </main>
  );
}
