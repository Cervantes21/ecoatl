// app/servicios/biopool/page.js
import ServicioCategory from '@/components/ServicioCategory';

export const metadata = {
  title: 'BioPiscinas | Blue Garden',
  description:
    'BioPiscinas con zonas de regeneración vegetal y filtración biológica de alto rendimiento. Estética natural, agua suave y bajo mantenimiento.',
};

export default function BioPoolPage() {
  return (
    <ServicioCategory
      slug="biopool"
      title="BioPiscinas"
      subtitle="Nada en agua suave y natural, sin cloro agresivo."
      videoBg={{
        src: '/Video_Listo_Biopiscina_Ecobrutalista.webm',
        poster: '/gallery/biopiscinas/biopool.webp',
        overlayOpacity: 0.55,
      }}
      tagline="Zonas de regeneración vegetal + filtración biológica = agua clara y agradable para la piel."
      description="Diseñamos y construimos BioPiscinas que integran filtración viva, plantas acuáticas y un circuito hidráulico eficiente. Combinamos acabados minerales y madera tratada con un planteamiento bioclimático para lograr estabilidad, baja huella energética y estética natural."
      bullets={[
        'Filtración biológica de alto rendimiento',
        'Zonas de regeneración vegetal',
        'Automatización y eficiencia energética',
      ]}
      features={[
        {
          title: 'Agua suave para la piel',
          desc: 'Sin cloro agresivo. Manejo biológico de nutrientes y desinfección auxiliar (UV opcional).',
        },
        {
          title: 'Estabilidad ecológica',
          desc: 'Plantado curado (oxigenadoras y florales) para soporte biológico y claridad sostenida.',
        },
        {
          title: 'Operación eficiente',
          desc: 'Bombas de bajo consumo, caudales calculados y limpieza técnica programable.',
        },
      ]}
      process={[
        { title: 'Diagnóstico y anteproyecto', desc: 'Objetivos, mediciones, volumetría, propuesta funcional y estética.' },
        { title: 'Construcción y equipamiento', desc: 'Obra limpia, instalación de filtros/UV, skimmers, plantado y acabados.' },
        { title: 'Maduración y entrega', desc: 'Ajustes finos, calendario biológico, manual de uso y plan de mantenimiento.' },
      ]}
      /* Puedes ampliar esta galería cuando agregues más fotos al folder /public/gallery/biopiscinas */
      gallery={[
        '/gallery/biopiscinas/biopool.webp',
        '/gallery/biopool.webp',
        '/gallery/IMG_20210525_153446.webp',
        '/gallery/IMG_20210525_153529.webp',
        '/gallery/IMG_20210525_153613.webp',
      ]}
      beforeAfter={[
        { before: '/gallery/testimonials/project3/before.webp', after: '/gallery/testimonials/project3/after.webp', label: 'BioPiscina 1' },
        { before: '/gallery/testimonials/project4/before.webp', after: '/gallery/testimonials/project4/after.webp', label: 'BioPiscina 2' },
      ]}
      faqs={[
        {
          q: '¿Usa químicos como una alberca tradicional?',
          a: 'Trabajamos con filtración biológica y manejo de nutrientes. Podemos integrar UV como apoyo. No usamos cloro agresivo.',
        },
        {
          q: '¿Qué mantenimiento requiere?',
          a: 'Depende del uso y entorno. Ofrecemos planes mensual, bimestral o estacional que incluyen limpieza, poda y revisión técnica.',
        },
        {
          q: '¿Se pueden calentar?',
          a: 'Sí. Podemos integrar sistemas de calefacción y automatización, cuidando el balance biológico y el consumo energético.',
        },
        {
          q: '¿Qué tan claras se mantienen?',
          a: 'Con diseño correcto (caudales, plantado, filtración) y un plan de mantenimiento, la claridad se mantiene estable en el tiempo.',
        },
      ]}
      ctas={{
        whatsapp: 'https://wa.me/5210000000000',
        diagnostic: '#contacto',
        portfolioHref: '/gallery',
      }}
    />
  );
}
