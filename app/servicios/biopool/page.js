// app/servicios/biopool/page.js
import ServicioCategory from '@/components/ServicioCategory';
import ContactCTA from '@/components/ContactCTA';
import ProjectShowcase from '@/components/ProjectShowcase';

// ✅ Solo Biopiscinas
import servicesData from '@/data/services.json';
import biopiscinasData from '@/data/biopiscinas.json';

// Iconos (estilo coherente con /servicios)
import {
  Droplets, Leaf, Wrench, ThermometerSun, Recycle, ShieldCheck, Waves, Timer,
} from 'lucide-react';

// Helpers server-side (inline)
import fs from 'node:fs';
import path from 'node:path';

export const metadata = {
  title: 'BioPiscinas | Blue Garden',
  description:
    'Diseño, construcción y conversión de albercas a BioPiscinas con filtración biológica, zonas de regeneración vegetal y automatización eficiente. Opciones híbridas con apoyo UV/ozono y climatización responsable.',
  alternates: { canonical: '/servicios/biopool' },
  openGraph: {
    title: 'BioPiscinas | Blue Garden',
    description:
      'Nada en agua suave y natural, sin cloro agresivo. Conversión de albercas a BioPiscinas, diseño a medida y automatización.',
    type: 'website',
    url: '/servicios/biopool',
    images: ['/gallery/biopool.webp'],
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
function pickCoverPath(project, basePath, fallback = '/gallery/biopool.webp') {
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
function enrichProjects(dataset = [], galleryBasePath = '/gallery/biopiscinas') {
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

/** Loader SOLO para biopiscinas */
function getBioPiscinasDataset() {
  const service = getServiceByIdOrSlug('biopiscinas') || {
    id: 'biopiscinas',
    slug: 'biopool',
    galleryBasePath: '/gallery/biopiscinas',
    title: 'BioPiscinas',
  };
  const galleryBasePath = service.galleryBasePath || '/gallery/biopiscinas';
  const dataset = Array.isArray(biopiscinasData) ? biopiscinasData : [];
  return { service, dataset, galleryBasePath };
}

export default function BioPoolPage() {
  const { service, dataset, galleryBasePath } = getBioPiscinasDataset();
  const projects = enrichProjects(dataset, galleryBasePath);

  // === Preguntas frecuentes (específicas de BioPiscinas) ===
  const faq = [
    {
      q: '¿Pueden convertir mi alberca en una BioPiscina?',
      a: 'Sí. Evaluamos estructura e instalaciones para integrar zona de regeneración, biofiltros y rehidráulica segura. En casos de alta demanda añadimos apoyo UV/ozono.'
    },
    {
      q: '¿El agua queda cristalina sin cloro?',
      a: 'La biofiltración controla nutrientes y las plantas consumen excedentes. Usamos pulido mecánico/UV cuando el contexto lo exige, manteniendo un tacto suave y sin olor.'
    },
    {
      q: '¿Qué mantenimiento requiere?',
      a: 'Podas ligeras de plantas, limpieza de pre-filtros y revisión de bombas/UV. Diseñamos para bajo mantenimiento con accesos fáciles y automatización donde aporta valor.'
    },
    {
      q: '¿Cuánto tardan en estar lista y clara?',
      a: 'La obra e instalación suelen tomar de 5 a 15 días según volumen y accesos. La madurez biológica da claridad visible entre 2–4 semanas, consolidándose en 4–8 semanas.'
    },
    {
      q: '¿Dan garantía?',
      a: 'Sí. Garantía por instalación y respaldo de fabricante en equipos. Incluimos visita de ajuste y guía de buenas prácticas durante el arranque.'
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
        title={service.title || 'BioPiscinas'}
        subtitle="Nada en agua suave y natural, sin cloro agresivo."
        videoBg={{
          src: '/Video_Listo_Biopiscina_Ecobrutalista.webm',
          poster: '/gallery/biopool.webp',
          overlayOpacity: 0.55,
        }}
        tagline="Zonas de regeneración + filtración biológica calibrada = agua clara, estable y amable con tu piel."
        description="Diseñamos y construimos BioPiscinas a tu gusto: desde cero, convirtiendo una alberca existente o con soluciones híbridas (biológico + soporte UV/ozono). Integramos plantas oxigenadoras y florales, medios minerales, skimmers, cascadas y un circuito hidráulico eficiente. Acabados naturales y planteamiento bioclimático para lograr estabilidad, bajo consumo y estética orgánica."
        bullets={[
          'Diseño 100% a tu gusto',
          'Conversión de alberca a BioPiscina',
          'Opción híbrida con UV/ozono',
          'Automatización y eficiencia energética',
          'Climatización responsable',
        ]}
      />

      {/* Características clave */}
      <section className="relative py-10 border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Características clave</h2>
          <p className="mt-2 text-white/80 max-w-3xl">
            BioPiscinas con agua suave y estable: combinamos biofiltración, plantas de regeneración y una
            hidráulica silenciosa para claridad duradera con bajo mantenimiento.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              Icon={Droplets}
              title="Agua suave y natural"
              desc="Filtración biológica que controla nutrientes; sin cloro agresivo. Apoyo UV/ozono solo cuando aporta valor."
            />
            <Feature
              Icon={Leaf}
              title="Regeneración vegetal"
              desc="Zonas plantadas con macrófitas oxigenadoras y ornamentales que estabilizan el sistema y embellecen."
            />
            <Feature
              Icon={Wrench}
              title="Ingeniería cuidadosa"
              desc="Cálculo de caudales, pérdidas de carga y retorno laminar para bajo consumo, poco ruido y fácil mantenimiento."
            />
            <Feature
              Icon={Waves}
              title="Híbridas para alta demanda"
              desc="Soluciones mixtas con prefiltrado mecánico + soporte UV/ozono para picos de uso."
            />
            <Feature
              Icon={ThermometerSun}
              title="Estabilidad térmica"
              desc="Profundidad, sombreados y materiales que moderan temperatura; climatización responsable opcional."
            />
            <Feature
              Icon={Recycle}
              title="Bajo mantenimiento"
              desc="Prefiltros accesibles, válvulas de purga y automatización donde realmente suma."
            />
            <Feature
              Icon={ShieldCheck}
              title="Seguridad y garantía"
              desc="Instalación profesional, equipos avalados por fabricante y acompañamiento en el arranque."
            />
          </div>
        </div>
      </section>

      {/* Proceso de trabajo */}
      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Proceso de trabajo</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-5">
              <Step
                number="1"
                title="Diagnóstico & objetivos"
                desc="Levantamiento del sitio, volumetría, usos previstos (nado/relax/mixto) y metas de claridad."
              />
              <Step
                number="2"
                title="Diseño & dimensionamiento"
                desc="Esquema de zonas de regeneración, biofiltros, hidráulica y selección de materiales y acabados."
              />
              <Step
                number="3"
                title="Obra & conversión"
                desc="Construcción o rehabilitación del vaso, instalación eléctrica/hidráulica segura y pruebas de caudal."
              />
              <Step
                number="4"
                title="Plantación & ciclado"
                desc="Inoculación bacteriana, plantación y balance inicial de nutrientes para estabilizar el sistema."
              />
              <Step
                number="5"
                title="Puesta a punto & acompañamiento"
                desc="Ajuste fino, guía de uso y visita de seguimiento para consolidar claridad y confort."
              />
            </div>

            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Timer className="h-5 w-5 text-emerald-300" /> Tiempos típicos
              </h3>
              <ul className="mt-3 space-y-2 text-white/80 text-sm list-disc pl-5">
                <li>Obra e instalación: 5–15 días (según volumen y accesos).</li>
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
      <ProjectShowcase projects={projects} title="Proyectos de BioPiscinas" />

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
