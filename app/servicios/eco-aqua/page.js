// app/servicios/ecosistemas/page.js
import ServicioCategory from '@/components/ServicioCategory';
import ContactCTA from '@/components/ContactCTA';
import ProjectShowcase from '@/components/ProjectShowcase';

// ✅ Dataset único de Ecosistemas
import servicesData from '@/data/services.json';
import ecosistemasData from '@/data/ecosistemas.json';

// Iconos (mismo estilo que /servicios)
import { Droplets, Leaf, Wrench, Waves, Recycle, ShieldCheck, Timer } from 'lucide-react';

// Helpers server-side (inline)
import fs from 'node:fs';
import path from 'node:path';

export const metadata = {
  title: 'Ecosistemas Acuáticos | Blue Garden',
  description:
    'Humedales construidos, lagos, cenotes y ríos artificiales. Diseño, construcción y mantenimiento con filtración biológica y paisajismo funcional.',
  alternates: { canonical: '/servicios/ecosistemas' },
  openGraph: {
    title: 'Ecosistemas Acuáticos | Blue Garden',
    description:
      'Microclimas vivos que se regulan por sí mismos: humedales, lagos, cenotes y ríos con bajo consumo y alto valor ecológico.',
    type: 'website',
    url: '/servicios/ecosistemas',
    images: ['/logo_blue-garden.webp'], // imagen segura existente
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
  try {
    return !!webPath && fs.existsSync(toFsPath(webPath));
  } catch {
    return false;
  }
}
function listImagesInFolder(webFolder = '') {
  try {
    if (!webFolder) return [];
    const dir = toFsPath(webFolder);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .filter((n) => IMG_RE.test(n))
      .sort()
      .map((n) => `${webFolder.replace(/\/$/, '')}/${n}`);
  } catch {
    return [];
  }
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

// ✅ Fallback seguro (evita 404 de portada)
const SAFE_FALLBACK = '/gallery/goldfish.webp';

function pickCoverPath(project, basePath, fallback = SAFE_FALLBACK) {
  const folder = resolveProjectFolder(project, basePath);
  const candidates = [`${folder}/cover.webp`, firstImageInFolder(folder)].filter(Boolean);
  for (const p of candidates) if (existsWebPath(p)) return p;
  return fallback;
}
function detectBeforeAfter(allImages = [], dataset = {}) {
  const dsBefore = dataset?.before || dataset?.antes || '';
  const dsAfter = dataset?.after || dataset?.despues || dataset?.después || '';
  let before = '',
    after = '';

  if (dsBefore && existsWebPath(dsBefore)) before = dsBefore;
  if (dsAfter && existsWebPath(dsAfter)) after = dsAfter;

  const byName = (rx) => allImages.find((p) => rx.test(p));
  if (!before) before = byName(/(?:^|\/)(before|antes)[^/]*\.(webp|jpg|jpeg|png)$/i) || '';
  if (!after) after = byName(/(?:^|\/)(after|despues|despu[eé]s)[^/]*\.(webp|jpg|jpeg|png)$/i) || '';
  return before && after ? { before, after, label: dataset?.label || 'Antes/Después' } : null;
}

/** Enriquecer dataset con imágenes existentes y A/D por proyecto */
function enrichProjects(dataset = [], galleryBasePath = '/gallery/ecosistemas') {
  return (Array.isArray(dataset) ? dataset : []).map((p) => {
    const folder = resolveProjectFolder(p, galleryBasePath);
    const cover = pickCoverPath(p, galleryBasePath, SAFE_FALLBACK);
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
      // Categorías
      category: p.categoria || p.category || p.tipo || '',
      superCategory:
        p.granCategoria || p.granCategory || p.superCategory || p.supercategoria || '',
      features: p.features || [],
      testimonial: p.testimonial || null,
      cover,
      images, // [{src, alt}]
      beforeAfter, // {before, after, label}
    };
  });
}

/** Normaliza categorías para "Gran Ecosystem" */
function normalizeCat(raw = '') {
  const v = String(raw || '').trim().toLowerCase();
  if (/^r(í|i)os?$/.test(v)) return 'rios';
  if (/^cenote(s)?$/.test(v)) return 'cenotes';
  if (/^lago(s)?$/.test(v)) return 'lagos';
  if (/^humedal(es)?$/.test(v)) return 'humedales';
  return v.replace(/\s+/g, '-');
}

/** Agrupa:
 * - "Gran Ecosystem" → subcategorías: cenotes, lagos, humedales y ríos
 * - resto → por categoría normalizada
 */
function splitGroups(projects = []) {
  const GE_KEYS = ['cenotes', 'lagos', 'humedales', 'rios'];

  const gran = { key: 'gran-ecosystem', label: 'Gran Ecosystem', sub: {} };
  GE_KEYS.forEach((k) => (gran.sub[k] = []));

  const othersMap = new Map();

  for (const p of projects) {
    const cat = normalizeCat(p.category);
    const isGran =
      String(p.superCategory || '').toLowerCase() === 'gran-ecosystem' ||
      GE_KEYS.includes(cat);

    if (isGran && GE_KEYS.includes(cat)) {
      gran.sub[cat].push(p);
    } else {
      const key = cat || 'ecosistemas';
      const label =
        key === 'ecosistemas'
          ? 'Ecosistemas'
          : key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ');
      if (!othersMap.has(key)) othersMap.set(key, { key, label, items: [] });
      othersMap.get(key).items.push(p);
    }
  }

  const granHasAny = Object.values(gran.sub).some((arr) => arr.length);
  const others = Array.from(othersMap.values());

  return { gran: granHasAny ? gran : null, others };
}

/* ===========================
   Loader SOLO Ecosistemas (FIX: aplanar dataset)
=========================== */

// Mapea nombres de bloque → slug de categoría
const CAT_MAP = {
  'Eco-Small': 'eco-small',
  'Eco-Medium': 'eco-medium',
  'Grand Ecosystem': 'gran-ecosystem', // supercategoría
};

// Convierte [{categoria, proyectos:[...]}, ...] → [{...proyecto, category, superCategory}, ...]
function flattenEcosistemasData(raw = []) {
  const out = [];
  for (const block of raw) {
    const catName = block?.categoria || '';
    const catSlug =
      CAT_MAP[catName] || String(catName || '').trim().toLowerCase().replace(/\s+/g, '-');

    const list = Array.isArray(block?.proyectos) ? block.proyectos : [];
    for (const p of list) {
      if (catSlug === 'gran-ecosystem') {
        // Para Grand Ecosystem: asignar subcategoría (cenotes, lagos, humedales, rios)
        const subCat =
          (p?.categoria && String(p.categoria).trim().toLowerCase()) ||
          (p?.id && String(p.id).trim().toLowerCase()) ||
          '';
        out.push({
          ...p,
          superCategory: 'gran-ecosystem',
          category:
            /^r(í|i)os?$/.test(subCat) ? 'rios' :
            /^cenote(s)?$/.test(subCat) ? 'cenotes' :
            /^lago(s)?$/.test(subCat) ? 'lagos' :
            /^humedal(es)?$/.test(subCat) ? 'humedales' :
            subCat,
        });
      } else {
        // Eco-small / Eco-medium
        out.push({
          ...p,
          category: catSlug,
          superCategory: '',
        });
      }
    }
  }
  return out;
}

function getEcosistemasDataset() {
  const service =
    getServiceByIdOrSlug('ecosistemas') || {
      id: 'ecosistemas',
      slug: 'ecosistemas',
      galleryBasePath: '/gallery/ecosistemas',
      title: 'Ecosistemas Acuáticos',
    };
  const galleryBasePath = service.galleryBasePath || '/gallery/ecosistemas';

  // ⬇️ FIX: aplanar el JSON por categorías en una lista única de proyectos
  const datasetRaw = Array.isArray(ecosistemasData) ? ecosistemasData : [];
  const dataset = flattenEcosistemasData(datasetRaw);

  return { service, dataset, galleryBasePath };
}

export default function EcosistemasPage() {
  const { service, dataset, galleryBasePath } = getEcosistemasDataset();
  const enriched = enrichProjects(dataset, galleryBasePath);
  const { gran, others } = splitGroups(enriched);

  // === Preguntas frecuentes (extendidas y específicas) ===
  const faq = [
    {
      q: '¿Qué incluye un proyecto de Ecosistema Acuático?',
      a: 'Diagnóstico hidrológico del sitio, diseño de hidráulica (succión/retorno), dimensionamiento de biofiltros y selección de macrófitas. Incluye obra, plantación, ciclado biológico, puesta a punto y guía de manejo.',
    },
    {
      q: '¿Cómo se evita la proliferación de mosquitos u olores?',
      a: 'Con agua en movimiento, oxigenación y un balance correcto de nutrientes no hay criaderos ni malos olores. Los skimmers y caídas de agua ayudan a airear y a mantener la lámina limpia.',
    },
    {
      q: '¿Qué diferencia hay entre humedales, lagos, cenotes y ríos artificiales?',
      a: 'Humedales: filtros verdes de flujo subsuperficial. Lagos: cuerpos de agua abiertos con biofiltración y paisajismo. Cenotes: espejos profundos y sombreados con gran inercia térmica. Ríos artificiales: canales con caudal controlado y caídas para oxigenación.',
    },
    {
      q: '¿Puedo usar agua de lluvia o de pozo?',
      a: 'Sí. Diseñamos pretratamiento y almacenamiento para lluvia y adaptamos el sistema a la dureza o metales del pozo. En ambos casos calibramos el arranque biológico para estabilidad.',
    },
    {
      q: '¿Requiere permisos o normativa?',
      a: 'En predios privados usualmente basta con licencias de obra/instalación. Para descargas a red pluvial, cuerpos naturales o pozos de absorción pueden aplicar permisos municipales o ambientales. Te orientamos según tu ubicación.',
    },
    {
      q: '¿Cuáles son los tiempos típicos y el mantenimiento?',
      a: 'Obra e instalación: 5–20 días según escala y accesos. Claridad visible: 2–4 semanas; estabilidad biológica: 4–8 semanas. El mantenimiento se basa en podas ligeras, purgas y limpieza de prefiltros.',
    },
    {
      q: '¿Se integra fauna (peces, anfibios, aves)?',
      a: 'Sí. El diseño contempla refugios, plantas y caudales que favorecen fauna benéfica y polinizadores, respetando el equilibrio sin introducir especies invasoras.',
    },
    {
      q: '¿Qué consumo eléctrico tiene?',
      a: 'Usamos bombas de alta eficiencia y retorno laminar; dimensionamos para caudales óptimos, no sobredimensionados. Opcionalmente integramos control horario y variadores.',
    },
  ];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      {/* Hero */}
      <ServicioCategory
        slug={service.slug}
        title={service.title || 'Ecosistemas Acuáticos'}
        subtitle="Microclimas vivos que se regulan por sí mismos."
        videoBg={{ src: '/estanque.webm', poster: '/gallery/goldfish.webp', overlayOpacity: 0.55 }}
        tagline="Menos químicos, más vida. Claridad estable con bajo consumo."
        description="Diseñamos humedales construidos, lagos, cenotes y ríos artificiales que refrescan el microclima, atraen fauna benéfica y se mantienen claros con biofiltración y paisajismo funcional."
        bullets={[
          'Humedales construidos',
          'Lagos ornamentales',
          'Cenotes artificiales',
          'Ríos & arroyos con caídas',
        ]}
      />

      {/* Características clave */}
      <section className="relative py-10 border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Características clave</h2>
          <p className="mt-2 text-white/80 max-w-3xl">
            Sistemas vivos que equilibran biología, hidráulica y paisaje para lograr agua clara, bajo consumo y valor ecológico real.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature Icon={Leaf} title="Vegetación funcional" desc="Macrófitas oxigenadoras y filtros verdes que consumen nutrientes y estabilizan el sistema." />
            <Feature Icon={Droplets} title="Ciclos biológicos" desc="Nitrificación y pulido fino para claridad duradera sin dependencia de químicos." />
            <Feature Icon={Wrench} title="Hidráulica eficiente" desc="Caudales y retornos laminares para bajo consumo y mantenimiento sencillo." />
            <Feature Icon={Waves} title="Arroyos & lagunas" desc="Flujos serenos con cascadas que airean, reducen algas y mejoran el confort térmico." />
            <Feature Icon={Recycle} title="Gestión pluvial" desc="Jardines de lluvia y recarga de suelos para aprovechar escorrentías y reducir inundaciones." />
            <Feature Icon={ShieldCheck} title="Instalación segura" desc="Obra profesional, equipos confiables y acompañamiento en el arranque biológico." />
          </div>
        </div>
      </section>

      {/* Proceso de trabajo */}
      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Proceso de trabajo</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-5">
              <Step number="1" title="Diagnóstico & potencial hídrico" desc="Levantamiento, escorrentías, soleamiento y objetivos estéticos/funcionales." />
              <Step number="2" title="Diseño & dimensionamiento" desc="Hidráulica, biofiltros, zonas vegetadas y selección de especies." />
              <Step number="3" title="Construcción & plantación" desc="Obra limpia, instalación eléctrica/hidráulica segura y plantado funcional-estético." />
              <Step number="4" title="Ciclado biológico" desc="Inoculación bacteriana, balance de nutrientes y ajuste fino de caudales." />
              <Step number="5" title="Arranque acompañado" desc="Visita de ajuste, guía de manejo y calendario de mantenimiento." />
            </div>

            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Timer className="h-5 w-5 text-emerald-300" /> Tiempos típicos
              </h3>
              <ul className="mt-3 space-y-2 text-white/80 text-sm list-disc pl-5">
                <li>Obra e instalación: 5–20 días (según escala y accesos).</li>
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

      {/* ===========================
          Gran Ecosystem (cenotes, lagos, humedales, ríos)
      ============================ */}
      {gran && (
        <>
          {/* Chips de subcategorías */}
          <section className="relative py-6 bg-black/30 border-t border-white/10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h3 className="text-white font-semibold">Gran Ecosystem</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(gran.sub)
                  .filter(([, items]) => items.length)
                  .map(([k]) => (
                    <a
                      key={k}
                      href={`#ge-${k}`}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 hover:bg-white/20"
                    >
                      {k === 'rios'
                        ? 'Ríos'
                        : k.charAt(0).toUpperCase() + k.slice(1)}
                    </a>
                  ))}
              </div>
            </div>
          </section>

          {/* Bloques por subcategoría */}
          {Object.entries(gran.sub)
            .filter(([, items]) => items.length)
            .map(([k, items]) => (
              <section key={k} id={`ge-${k}`} className="scroll-mt-24">
                <ProjectShowcase
                  projects={items}
                  title={
                    k === 'rios'
                      ? 'Proyectos: Ríos'
                      : `Proyectos: ${k.charAt(0).toUpperCase() + k.slice(1)}`
                  }
                />
              </section>
            ))}
        </>
      )}

      {/* Otras categorías (si existen) */}
      {others.map((g) => (
        <section key={g.key} id={`cat-${g.key}`} className="scroll-mt-24">
          <ProjectShowcase projects={g.items} title={`Proyectos: ${g.label}`} />
        </section>
      ))}

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
