// app/servicios/estanques/page.js
import ServicioCategory from '@/components/ServicioCategory';

export const metadata = {
  title: 'Estanques | Blue Garden',
  description: 'Estanques cristalinos con filtración biológica, plantas y peces. Diseño, construcción y mantenimiento.',
};

export default function EstanquesPage() {
  return (
    <ServicioCategory
      slug="estanques"
      title="Estanques"
      subtitle="Un santuario de vida en tu casa o negocio."
      videoBg={{ src: '/estanque.webm', poster: '/gallery/goldfish.webp', overlayOpacity: 0.55 }}
      tagline="Menos químicos, más vida. Claridad estable con bajo consumo."
      description="Diseñamos y construimos estanques con filtración biológica, vegetación curada y caudales optimizados. También hacemos remodelaciones y planes de mantenimiento."
      bullets={[
        'Filtración biológica y UV opcional',
        'Oxigenación y skimmers',
        'Paisajismo con flora nativa',
      ]}
      features={[
        { title: 'Filtración viva', desc: 'Medios biológicos y bacterias benéficas para agua clara y estable.' },
        { title: 'Eficiencia energética', desc: 'Bombas de bajo consumo y caudales ajustados al volumen real.' },
        { title: 'Estética natural', desc: 'Integración paisajística y acabados minerales tipo eco-brutalista.' },
      ]}
      process={[
        { title: 'Diagnóstico y diseño', desc: 'Levantamiento, objetivos estéticos/funcionales y propuesta.' },
        { title: 'Construcción/upgrade', desc: 'Obra limpia, instalación de filtros, caudales y plantado.' },
        { title: 'Maduración y ajustes', desc: 'Ajustes finos, calendario biológico y entrega con recomendaciones.' },
      ]}
      gallery={[
        '/gallery/goldfish.webp',
        '/gallery/IMG_20210518_115509.webp',
        '/gallery/IMG_20210525_153529.webp',
        '/gallery/IMG_20210525_153613.webp',
        '/gallery/20180810_162125.webp',
      ]}
      beforeAfter={[
        { before: '/gallery/testimonials/project1/before.webp', after: '/gallery/testimonials/project1/after.webp', label: 'Proyecto 1' },
        { before: '/gallery/testimonials/project2/before.webp', after: '/gallery/testimonials/project2/after.webp', label: 'Proyecto 2' },
      ]}
      faqs={[
        { q: '¿Requiere cloro?', a: 'No. Trabajamos con filtración biológica y manejo de nutrientes.' },
        { q: '¿Cuánto mantenimiento necesita?', a: 'Depende de la carga orgánica; ofrecemos planes mensual, bimestral o estacional.' },
        { q: '¿Puedo integrar peces?', a: 'Sí, con diseño de hábitat y balance de plantas/filtración.' },
      ]}
      ctas={{
        whatsapp: 'https://wa.me/527772568821',
        diagnostic: '#contacto',
        portfolioHref: '/gallery',
      }}
    />
  );
}
