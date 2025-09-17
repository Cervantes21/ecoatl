// app/servicios/estanques/page.js
import ServicioCategory from '@/components/ServicioCategory';
import ContactCTA from '@/components/ContactCTA';
import ProjectShowcase from '@/components/ProjectShowcase';

// ✅ Solo Estanques
import servicesData from '@/data/services.json';
import estanquesData from '@/data/estanques.json';

// Iconos (estilo coherente con /servicios)
import {
  Droplets, Leaf, Wrench, Waves, Recycle, ShieldCheck, Timer,
} from 'lucide-react';

// Helpers server-side (inline)
import fs from 'node:fs';
import path from 'node:path';

export const metadata = {
  title: 'Estanques | Blue Garden',
  description:
    'Estanques cristalinos con filtración biológica, plantas y peces. Diseño, construcción, remodelación y mantenimiento.',
  alternates: { canonical: '/servicios/estanques' },
  openGraph: {
    title: 'Estanques | Blue Garden',
    description:
      'Un santuario de vida en tu casa o negocio. Claridad estable con bajo consumo y paisajismo funcional.',
    type: 'website',
    url: '/servicios/estanques',
    images: ['/gallery/goldfish.webp'],
  },
};

/* ===========================
   UI helpers (estilo /servicios)
=========================== */
function Feature({ Icon, title, desc }) {
  return (
    <div className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 hover:bg-white/10 transition">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-emerald-500/20 p-2 ring-1 ring-emerald-400/30">
          <Icon className="h-5 w-5 text-emerald-300" />
        </div>
        <h4 className="text-white font-semibold">{title}</h4>
      </div>
      <p className="mt-2 text-sm text-white/80 leading-relaxed">{desc}</p>
    </div>
  );
}
function Step({ number, title, desc }) {
  return (
    <div className="relative pl-10">
      <div className="absolute left-0 top-0 h-8 w-8 flex items-center justify-center rounded-full bg-sky-600 text-white font-bold">
        {number}
      </div>
      <h4 className="text-white font-semibold">{title}</h4>
      <p className="mt-1 text-white/80 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ===========================
   FS helpers
=========================== */
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMG_RE = /\.(webp|jpg|jpeg|png)$/i;

function toFsPath(webPath = '') {
  const clean = `${webPath || ''}`.replace(/^\/+/, '');
  return path.join(PUBLIC_DIR, clean);
}
function existsWebPath(webPath = '') {
  try { return !!webPath && fs.existsSync(toFsPath(webPath)); } catch { return false; }
}
function listImagesInFolder(webFolder = '') {
  try {
    if (!webFolder) return [];
    const dir = toFsPath(webFolder);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .filter((n) => IMG_RE.test(n))
      .sort()
      .map((n) => `${webFolder.replace(/\/$/, '')}/${n}`);
  } catch { return []; }
}
function firstImageInFolder(webFolder = '') {
  return listImagesInFolder(webFolder)[0] || '';
}
function getServiceByIdOrSlug(idOrSlug) {
  const list = servicesData?.services || [];
  return list.find((s) => s.id === idOrSlug) || list.find((s) => s.slug === idOrSlug) || null;
}
function resolveProjectFolder(project, basePath) {
  const base = (basePath || '').replace(/\/$/, '');
  const fromDataset = `${project?.carpeta || ''}`.replace(/\/+$/, '');
  const byId = `${base}/${project?.id || ''}`.replace(/\/+$/, '');
  return fromDataset || byId;
}
function pickCoverPath(project, basePath, fallback = '/gallery/goldfish.webp') {
  const folder = resolveProjectFolder(project, basePath);
  const candidates = [`${folder}/cover.webp`, firstImageInFolder(folder)].filter(Boolean);
  for (const p of candidates) if (existsWebPath(p)) return p;
  return fallback;
}
function detectBeforeAfter(allImages = [], dataset = {}) {
  const dsBefore = dataset?.before || dataset?.antes || '';
  const dsAfter  = dataset?.after  || dataset?.despues || dataset?.después || '';
  let before = '', after = '';

  if (dsBefore && existsWebPath(dsBefore)) before = dsBefore;
  if (dsAfter  && existsWebPath(dsAfter))  after  = dsAfter;

  const byName = (rx) => allImages.find((p) => rx.test(p));
  if (!before) {
    before = byName(/(?:^|\/)(before|antes)[^/]*\.(webp|jpg|jpeg|png)$/i) || byName(/(?:^|\/)before[^/]*\.(webp|jpg|jpeg|png)$/i) || '';
  }
  if (!after) {
    after = byName(/(?:^|\/)(after|despues|despu[eé]s)[^/]*\.(webp|jpg|jpeg|png)$/i) || byName(/(?:^|\/)after[^/]*\.(webp|jpg|jpeg|png)$/i) || '';
  }
  return (before && after) ? { before, after, label: dataset?.label || 'Antes/Después' } : null;
}

/** Enriquecer dataset con imágenes existentes y A/D por proyecto */
function enrichProjects(dataset = [], galleryBasePath = '/gallery/estanques') {
  return (Array.isArray(dataset) ? dataset : []).map((p) => {
    const folder = resolveProjectFolder(p, galleryBasePath);
    const cover = pickCoverPath(p, galleryBasePath);
    const imgs = listImagesInFolder(folder);

    const images = imgs.map((src, i) => ({
      src,
      alt: `${p.nombre || p.title || 'Proyecto'} - ${i + 1}`,
    }));

    const beforeAfter = detectBeforeAfter(imgs, p);

    return {
      id: p.id || folder.split('/').pop() || 'project',
      title: p.nombre || p.title || 'Proyecto',
      location: p.ubicacion || p.location || '',
      date: p.fecha || p.date || '',
      summary: p.descripcion || p.summary || '',
      dimension: p.dimension || '',
      status: p.estado || p.status || '',
      features: p.features || [],
      testimonial: p.testimonial || null,
      cover,
      images,
      beforeAfter,
    };
  });
}

/** Loader SOLO para estanques */
function getEstanquesDataset() {
  const service = getServiceByIdOrSlug('estanques') || {
    id: 'estanques',
    slug: 'estanques',
    galleryBasePath: '/gallery/estanques',
    title: 'Estanques',
  };
  const galleryBasePath = service.galleryBasePath || '/gallery/estanques';
  const dataset = Array.isArray(estanquesData) ? estanquesData : [];
  return { service, dataset, galleryBasePath };
}

export default function EstanquesPage() {
  const { service, dataset, galleryBasePath } = getEstanquesDataset();
  const projects = enrichProjects(dataset, galleryBasePath);

  // === Preguntas frecuentes (específicas de Estanques) ===
  const faq = [
    {
      q: '¿Requiere cloro?',
      a: 'No. Trabajamos con filtración biológica y manejo de nutrientes. Podemos sumar UV para pulido cuando es útil, sin depender de químicos.'
    },
    {
      q: '¿Cuánto mantenimiento necesita?',
      a: 'Diseñamos para bajo mantenimiento: limpieza de pre-filtros, podas ligeras y revisión de bombas. Ofrecemos planes mensual, quincenal o estacional.'
    },
    {
      q: '¿Puedo integrar peces y plantas?',
      a: 'Sí. Diseñamos el hábitat completo: refugios, oxigenación y macrófitas que consumen nutrientes, manteniendo el agua clara y saludable.'
    },
    {
      q: '¿Habrá mosquitos u olor?',
      a: 'No, con agua en movimiento, oxigenación y equilibrio biológico no se generan criaderos ni malos olores.'
    },
    {
      q: '¿En cuánto tiempo queda claro?',
      a: 'Según volumen y carga orgánica: obra/instalación 5–12 días; claridad visible 2–4 semanas; estabilidad biológica 4–8 semanas.'
    },
  ];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faq.map(({ q, a }) => ({
      '@type': 'Question',
      'name': q,
      'acceptedAnswer': { '@type': 'Answer', 'text': a }
    }))
  };

  return (
    <>
      {/* Hero */}
      <ServicioCategory
        slug={service.slug}
        title={service.title || 'Estanques'}
        subtitle="Un santuario de vida en tu casa o negocio."
        videoBg={{ src: '/estanque.webm', poster: '/gallery/goldfish.webp', overlayOpacity: 0.55 }}
        tagline="Menos químicos, más vida. Claridad estable con bajo consumo."
        description="Diseñamos y construimos estanques con filtración biológica, vegetación curada y caudales optimizados. También hacemos remodelaciones y planes de mantenimiento."
        bullets={[
          'Filtración biológica y UV opcional',
          'Oxigenación y skimmers',
          'Paisajismo con flora nativa',
        ]}
      />

      {/* Características clave */}
      <section className="relative py-10 border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Características clave</h2>
        <p className="mt-2 text-white/80 max-w-3xl">
          Estanques cristalinos con bajo consumo y alto valor ecológico: filtración viva, caudales calculados y paisajismo funcional.
        </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature Icon={Droplets} title="Agua clara y oxigenada" desc="Ciclos biológicos maduros y oxigenación continua para peces sanos y agua transparente." />
            <Feature Icon={Leaf} title="Paisajismo nativo" desc="Macrófitas que consumen nutrientes y atraen polinizadores; estética natural todo el año." />
            <Feature Icon={Wrench} title="Hidráulica eficiente" desc="Caudales y retornos laminares con bombas de bajo consumo y prefiltrado accesible." />
            <Feature Icon={Waves} title="Skimmers & caídas" desc="Láminas de agua serenas, skimmers para hojas y cascadas silenciosas que airean." />
            <Feature Icon={Recycle} title="Bajo mantenimiento" desc="Purgas, podas ligeras y limpieza simple de prefiltros con accesos cómodos." />
            <Feature Icon={ShieldCheck} title="Seguridad & garantía" desc="Instalación profesional, equipos confiables y acompañamiento durante el arranque." />
          </div>
        </div>
      </section>

      {/* Proceso de trabajo */}
      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Proceso de trabajo</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-5">
              <Step number="1" title="Diagnóstico & objetivos" desc="Levantamiento del sitio, volumetría, exposición solar y metas de claridad/uso." />
              <Step number="2" title="Diseño & dimensionamiento" desc="Propuesta de biofiltros, oxigenación, skimmers y selección de especies vegetales." />
              <Step number="3" title="Construcción & montaje" desc="Obra limpia, instalación eléctrica/hidráulica segura y pruebas de caudal." />
              <Step number="4" title="Plantación & ciclado" desc="Inoculación bacteriana, plantado y balance inicial de nutrientes." />
              <Step number="5" title="Arranque acompañado" desc="Ajuste fino, guía de cuidado y visita de seguimiento para consolidar estabilidad." />
            </div>

            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Timer className="h-5 w-5 text-emerald-300" /> Tiempos típicos
              </h3>
              <ul className="mt-3 space-y-2 text-white/80 text-sm list-disc pl-5">
                <li>Obra e instalación: 5–12 días (según volumen y accesos).</li>
                <li>Claridad visible: 2–4 semanas.</li>
                <li>Estabilidad biológica: 4–8 semanas.</li>
              </ul>

              <h3 className="mt-6 text-white font-semibold flex items-center gap-2">
                <Wrench className="h-5 w-5 text-emerald-300" /> Requisitos del sitio
              </h3>
              <ul className="mt-3 space-y-2 text-white/80 text-sm list-disc pl-5">
                <li>Alimentación eléctrica estable y tierra física.</li>
                <li>Drenaje o punto de desagüe para purgas.</li>
                <li>Área para biofiltros/prefiltros con acceso seguro.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proyectos + modal */}
      <ProjectShowcase projects={projects} title="Proyectos de Estanques" />

      {/* Preguntas frecuentes */}
      <section className="relative py-10 border-t border-white/10 bg-black/30" id="faq">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Preguntas frecuentes</h2>
          <div className="mt-4 grid gap-3">
            {faq.map(({ q, a }) => (
              <details key={q} className="group rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
                <summary className="cursor-pointer list-none text-white font-medium">
                  {q}
                </summary>
                <p className="mt-2 text-white/80 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* JSON-LD FAQPage para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div id="contacto" className="sr-only" />
      <ContactCTA />
    </>
  );
}
