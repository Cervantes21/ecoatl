// app/servicios/eco-aqua/page.js
import ServicioCategory from '@/components/ServicioCategory';

export const metadata = {
  title: 'Ecosistemas Acuáticos | Blue Garden',
  description:
    'Cascadas, riachuelos, espejos de agua y muros llorones con filtración biológica, iluminación y paisajismo integrado.',
};

export default function EcoAquaPage() {
  return (
    <ServicioCategory
      slug="eco-aqua"
      title="Ecosistemas Acuáticos"
      subtitle="Cascadas, espejos de agua, riachuelos y muros llorones que dan vida a tus espacios."
      videoBg={{
        src: '/Estanque_Adentro_Afuera.webm',
        poster: '/gallery/ecosistemas/IMG_20210518_115543.webp',
        overlayOpacity: 0.55,
      }}
      tagline="Piezas de agua para interior y exterior con operación silenciosa, bajo consumo y estética natural."
      description="Diseñamos experiencias sensoriales con agua: desde espejos serenos y riachuelos hasta muros llorones y cascadas. Integramos filtración biológica, control de sonido, iluminación y niebla para lograr presencia visual sin sacrificar eficiencia."
      bullets={[
        'Diseño bioclimático y paisajismo',
        'Filtración biológica y circuitos silenciosos',
        'Iluminación y niebla ambiental',
      ]}
      features={[
        {
          title: 'Operación silenciosa',
          desc: 'Dimensionado de caudales, caída y materiales para un flujo armónico y de baja turbulencia.',
        },
        {
          title: 'Bajo mantenimiento',
          desc: 'Circuitos con prefiltrado, skimmers y medios biológicos que contienen algas y sedimentos.',
        },
        {
          title: 'Estética integrada',
          desc: 'Acabados minerales, vegetación curada y trazos orgánicos para una integración natural.',
        },
      ]}
      process={[
        { title: 'Anteproyecto', desc: 'Levantamiento, objetivos sensoriales, volumetría y propuesta estética/funcional.' },
        { title: 'Construcción e instalación', desc: 'Estructura, impermeabilización, bombas, filtros, iluminación y niebla.' },
        { title: 'Ajuste fino y entrega', desc: 'Calibración de caudales, pruebas de sonido, guía de uso y plan de mantenimiento.' },
      ]}
      /* Amplía estas rutas cuando agregues más fotos en /public/gallery/ecosistemas */
      gallery={[
        '/gallery/ecosistemas/IMG_20210518_115543.webp',
        '/gallery/ecosistemas/WhatsApp Image 2025-06-16 at 14.48.41 (3).webp',
        '/gallery/ecosistemas/WhatsApp Image 2025-08-04 at 22.11.07.webp',
        '/gallery/IMG_20210518_115509.webp',
        '/gallery/IMG_20210518_115509.webp',
      ]}
      beforeAfter={[
        { before: '/gallery/testimonials/project1/before.webp', after: '/gallery/testimonials/project1/after.webp', label: 'Espejo de agua' },
        { before: '/gallery/testimonials/project2/before.webp', after: '/gallery/testimonials/project2/after.webp', label: 'Cascada y riachuelos' },
      ]}
      faqs={[
        {
          q: '¿El sonido del agua puede ajustarse?',
          a: 'Sí. Diseñamos altura, caudal y textura de caída para lograr desde un murmullo sutil hasta una cascada más presente.',
        },
        {
          q: '¿Cómo se controla el crecimiento de algas?',
          a: 'Con prefiltrado, medios biológicos y manejo de nutrientes. La selección de plantas y el asoleamiento también influyen.',
        },
        {
          q: '¿Funciona en interior?',
          a: 'Sí. Consideramos salpicaduras, humedad y ventilación. Podemos integrar niebla e iluminación controlada.',
        },
        {
          q: '¿Qué mantenimiento requiere?',
          a: 'Limpiezas técnicas periódicas y poda ligera. Ofrecemos planes mensual, bimestral o estacional según el uso.',
        },
      ]}
      ctas={{
        whatsapp: 'https://wa.me/527772568821',
        diagnostic: '#contacto',
        portfolioHref: '/gallery',
      }}
    />
  );
}
