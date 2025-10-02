// app/gallery/page.js
import ProjectShowcase from '@/components/ProjectShowcase';
import ContactCTA from '@/components/ContactCTA.jsx';
import Image from 'next/image';
import Link from 'next/link';
import { FaLeaf, FaFish } from 'react-icons/fa';
import { ChevronRight } from 'lucide-react';

import servicesData from '@/data/services.json';
import biopiscinasData from '@/data/biopiscinas.json';
import estanquesData from '@/data/estanques.json';
import ecosistemasData from '@/data/ecosistemas.json';

import fs from 'node:fs';
import path from 'node:path';

export const metadata = {
  title: 'Galería | Atl Ecosystem',
  description: 'Explora proyectos de Atl Ecosystem por categoría: BioPiscinas, Estanques y Ecosistemas.',
};

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMG_RE = /\.(webp|jpg|jpeg|png)$/i;
const BEFORE_RE = /(?:^|\/)(before|antes)[^/]*\.(webp|jpg|jpeg|png)$/i;
const AFTER_RE  = /(?:^|\/)(after|despues|despu[eé]s)[^/]*\.(webp|jpg|jpeg|png)$/i;
const SAFE_FALLBACK = '/gallery/goldfish.webp';

const exists = (p) => { try { return fs.existsSync(p); } catch { return false; } };
const list = (p) => { try { return fs.readdirSync(p, { withFileTypes: true }); } catch { return []; } };
const toFs = (web) => path.join(PUBLIC_DIR, String(web || '').replace(/^\/+/, ''));

// ---------- ID registry (evita keys duplicadas) ----------
const idRegistry = new Set();
function uniqueId(base) {
  let id = base || 'proj';
  let n = 1;
  while (idRegistry.has(id)) {
    n += 1;
    id = `${base}__${n}`;
  }
  idRegistry.add(id);
  return id;
}

// ---------- Utils de imágenes / carpetas ----------
function listImages(webFolder = '') {
  const abs = toFs(webFolder);
  if (!exists(abs)) return [];
  return list(abs)
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((n) => IMG_RE.test(n))
    .sort()
    .map((n) => `${webFolder.replace(/\/$/, '')}/${n}`);
}
function firstImage(webFolder = '') { return listImages(webFolder)[0] || ''; }

function resolveFolderFromDataset(project, basePath) {
  const base = (basePath || '').replace(/\/$/, '');
  const custom = `${project?.carpeta || ''}`.replace(/\/+$/, '');
  if (custom) return custom.startsWith('/gallery/') ? custom : `${base}/${custom}`;
  if (project?.id) return `${base}/${project.id}`;
  return base;
}
function pickCover(project, basePath) {
  const folder = resolveFolderFromDataset(project, basePath);
  const candidates = [`${folder}/cover.webp`, firstImage(folder)].filter(Boolean);
  for (const w of candidates) if (exists(toFs(w))) return w;
  return SAFE_FALLBACK;
}
function detectBeforeAfter(imgs = [], dataset = {}) {
  const dsBefore = dataset?.before || dataset?.antes || '';
  const dsAfter  = dataset?.after  || dataset?.despues || dataset?.después || '';
  let before = '', after = '';
  if (dsBefore && exists(toFs(dsBefore))) before = dsBefore;
  if (dsAfter  && exists(toFs(dsAfter)))  after  = dsAfter;
  const byName = (rx) => imgs.find((p) => rx.test(p));
  if (!before) before = byName(BEFORE_RE) || '';
  if (!after)  after  = byName(AFTER_RE)  || '';
  return before && after ? { before, after } : undefined;
}

function safeBaseId(p, folder, prefix) {
  const raw =
    String(p.id || p.slug || p.nombre || p.title || path.basename(folder) || 'proj')
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  return prefix ? `${prefix}__${raw}` : raw;
}

function enrichProjects(dataset = [], galleryBasePath = '/gallery', prefix = '') {
  return (Array.isArray(dataset) ? dataset : []).map((p) => {
    const folder = resolveFolderFromDataset(p, galleryBasePath);
    const imgs = listImages(folder);
    const images = imgs.map((src, i) => ({ src, alt: `${p.nombre || p.title || 'Proyecto'} - ${i + 1}` }));
    const cover = pickCover(p, galleryBasePath);
    const imagesOrdered = images.sort((a, b) => (a.src === cover ? -1 : b.src === cover ? 1 : 0));

    const baseId = safeBaseId(p, folder, prefix);
    const id = uniqueId(baseId);

    return {
      id,
      title: p.nombre || p.title || 'Proyecto',
      location: p.ubicacion || p.location || '',
      date: p.fecha || p.date || '',
      summary: p.descripcion || p.summary || '',
      dimension: p.dimension || '',
      status: p.estado || p.status || '',
      features: p.features || [],
      testimonial: p.testimonial || null,
      cover,
      images: imagesOrdered,
      beforeAfter: detectBeforeAfter(imgs, p),
    };
  });
}

// ---------- Helpers para buscar metadata de ecosistemas.json ----------
function flattenEcoDataset(data) {
  const out = [];
  if (Array.isArray(data)) {
    for (const item of data) {
      if (Array.isArray(item?.proyectos)) out.push(...item.proyectos);
      else if (item && typeof item === 'object') out.push(item);
    }
  } else if (data && typeof data === 'object') {
    for (const k of Object.keys(data)) {
      const bucket = data[k];
      if (Array.isArray(bucket)) out.push(...bucket);
      else if (bucket && Array.isArray(bucket.proyectos)) out.push(...bucket.proyectos);
    }
  }
  return out;
}

// Busca por coincidencia de `carpeta` (relativa) o por `id`
function findEcoMeta(relFolder) {
  const all = flattenEcoDataset(ecosistemasData);
  const norm = (s) => String(s || '').replace(/^\/+|\/+$/g, '');
  const target = norm(relFolder);
  return all.find((p) => norm(p.carpeta) === target)
      || all.find((p) => norm(p.id) === path.basename(target));
}

// ---------- Helpers para Ecosistemas (bloques) ----------
const pretty = (s = '') =>
  s.replace(/[-_]/g, ' ')
   .replace(/\b\w/g, (m) => m.toUpperCase())
   .replace(/\bEco\b/i, 'Eco');

const DEFAULT_SUMMARY = {
  Cenotes: 'Proyectos inspirados en los cenotes naturales de México, con aguas cristalinas y vegetación nativa.',
  Humedales: 'Restauración y creación de humedales artificiales para filtrar agua y fomentar biodiversidad.',
  Lagos: 'Diseño y construcción de lagos ornamentales y funcionales para grandes espacios.',
  Ríos: 'Recreación de cauces de río con integración de filtración natural y vegetación.',
};

function collectEcoGroups(basePath = '/gallery/ecosistemas') {
  const groups = [];

  // 1) eco-small (projects directos)
  const ecoSmallPath = `${basePath}/eco-small`;
  if (exists(toFs(ecoSmallPath))) {
    const projs = list(toFs(ecoSmallPath)).filter((d) => d.isDirectory()).map((d) => d.name);
    const ds = projs.map((p) => {
      const carpeta = `eco-small/${p}`;
      const meta = findEcoMeta(carpeta) || {};
      return {
        id: `eco-small-${p}`,
        carpeta,
        nombre: meta.nombre || pretty(p),
        ubicacion: meta.ubicacion || meta.location || '',
        descripcion: meta.descripcion || meta.summary || '',
        dimension: meta.dimension || '',
        estado: meta.estado || meta.status || '',
        before: meta.before, after: meta.after,
      };
    });
    groups.push({ key: 'eco-small', label: 'Eco Small', projects: enrichProjects(ds, basePath, 'eco-small') });
  }

  // 2) eco-medium (projects directos)
  const ecoMediumPath = `${basePath}/eco-medium`;
  if (exists(toFs(ecoMediumPath))) {
    const projs = list(toFs(ecoMediumPath)).filter((d) => d.isDirectory()).map((d) => d.name);
    const ds = projs.map((p) => {
      const carpeta = `eco-medium/${p}`;
      const meta = findEcoMeta(carpeta) || {};
      return {
        id: `eco-medium-${p}`,
        carpeta,
        nombre: meta.nombre || pretty(p),
        ubicacion: meta.ubicacion || meta.location || '',
        descripcion: meta.descripcion || meta.summary || '',
        dimension: meta.dimension || '',
        estado: meta.estado || meta.status || '',
        before: meta.before, after: meta.after,
      };
    });
    groups.push({ key: 'eco-medium', label: 'Eco Medium', projects: enrichProjects(ds, basePath, 'eco-medium') });
  }

  // 3) grand-ecosystem/* (cenotes, lagos, humedales, rios)
  const grandPath = `${basePath}/grand-ecosystem`;
  if (exists(toFs(grandPath))) {
    const subcats = list(toFs(grandPath)).filter((d) => d.isDirectory()).map((d) => d.name);

    // Orden fijo opcional:
    const order = ['cenotes', 'humedales', 'lagos', 'rios'];
    const sorted = subcats.sort((a, b) => order.indexOf(a) - order.indexOf(b));

    for (const sub of sorted) {
      const subPath = `${grandPath}/${sub}`;
      const entries = list(toFs(subPath));
      const subdirs = entries.filter((d) => d.isDirectory()).map((d) => d.name);
      const files = entries.filter((d) => d.isFile()).map((d) => d.name).filter((n) => IMG_RE.test(n));

      const projects = [];

      if (subdirs.length > 0) {
        // Caso con project-* dentro (rios en tu árbol)
        for (const proj of subdirs) {
          const carpeta = `grand-ecosystem/${sub}/${proj}`;
          const meta = findEcoMeta(carpeta) || {};
          projects.push({
            id: `grand-ecosystem-${sub}-${proj}`,
            carpeta,
            nombre: meta.nombre || pretty(`${sub} ${proj}`),
            ubicacion: meta.ubicacion || meta.location || '',
            descripcion: meta.descripcion || meta.summary || DEFAULT_SUMMARY[pretty(sub)] || '',
            dimension: meta.dimension || '',
            estado: meta.estado || meta.status || '',
            before: meta.before, after: meta.after,
          });
        }
      }

      if (files.length > 0) {
        // Caso carpeta con imágenes sueltas (cenotes, humedales, lagos)
        const carpeta = `grand-ecosystem/${sub}`;
        const meta = findEcoMeta(carpeta) || {};
        projects.push({
          id: `grand-ecosystem-${sub}`,
          carpeta,
          nombre: meta.nombre || pretty(sub),
          ubicacion: meta.ubicacion || meta.location || '',
          descripcion: meta.descripcion || meta.summary || DEFAULT_SUMMARY[pretty(sub)] || '',
          dimension: meta.dimension || '',
          estado: meta.estado || meta.status || '',
          before: meta.before, after: meta.after,
        });
      }

      if (projects.length > 0) {
        groups.push({
          key: `grand-${sub}`,
          label: pretty(sub), // Cenotes, Humedales, Lagos, Ríos
          projects: enrichProjects(projects, basePath, `eco-${sub}`),
        });
      }
    }
  }

  return groups;
}

// ---------- Página ----------
export default function GalleryPage() {
  idRegistry.clear(); // reset por request

  const bioService = (servicesData?.services || []).find((s) => s.slug === 'biopiscinas')
    || { galleryBasePath: '/gallery/biopiscinas' };
  const bioProjects = enrichProjects(biopiscinasData, bioService.galleryBasePath, 'bio');

  const pondService = (servicesData?.services || []).find((s) => s.slug === 'estanques')
    || { galleryBasePath: '/gallery/estanques' };
  const pondProjects = enrichProjects(estanquesData, pondService.galleryBasePath, 'pond');

  const ecoService = (servicesData?.services || []).find((s) => s.slug === 'ecosistemas')
    || { galleryBasePath: '/gallery/ecosistemas' };
  const ecoGroups = collectEcoGroups(ecoService.galleryBasePath);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 pt-16 md:pt-20 lg:pt-24">
      <SectionWithLink title="Proyectos de BioPiscinas" href="/servicios/biopool">
        <ProjectShowcase title="" projects={bioProjects} />
      </SectionWithLink>

      <SectionWithLink title="Proyectos de Estanques" href="/servicios/estanques">
        <ProjectShowcase title="" projects={pondProjects} />
      </SectionWithLink>

      {/* Ecosistemas en bloques, dentro de una sola sección */}
      <section className="scroll-mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Proyectos de Ecosistemas</h2>
            <Link
              href="/servicios/eco-aqua"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white
                         hover:bg-emerald-700 active:scale-[0.99] transition
                         focus:outline-none focus:ring-2 focus:ring-emerald-500
                         focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Ver más
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {ecoGroups.map((g) => (
            <div key={g.key}>
              <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">{g.label}</h3>
              <ProjectShowcase title="" projects={g.projects} />
            </div>
          ))}
        </div>
      </section>

      {/* Bloque informativo plantas/peces (compacto) */}
      <section className="relative py-12 overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover z-0">
          <source src="/Estanque_Adentro_Afuera.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="container mx-auto px-4 relative z-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Sumérgete en nuestras galerías</h2>
            <p className="mt-2 text-base md:text-lg text-gray-200">
              Explora especies y variedades que usamos en los proyectos.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <CategoryCard
              icon={<FaLeaf className="h-7 w-7" aria-hidden="true" />}
              title="Galería de plantas"
              href="/products/plants"
              description="Oxigenadoras, flotantes, palustres y tapizantes para lograr un equilibrio saludable."
              image={{ src: '/gallery/plantas-acuaticas.webp', alt: 'Plantas acuáticas Atl Ecosystem' }}
              cta="Ver plantas"
            />
            <CategoryCard
              icon={<FaFish className="h-7 w-7" aria-hidden="true" />}
              title="Galería de peces"
              href="/products/fish"
              description="Koi, goldfish y especies compatibles para estanques y acuarios."
              image={{ src: '/gallery/koi-fish.webp', alt: 'Peces para estanques y acuarios' }}
              cta="Ver peces"
            />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-center text-xs md:text-sm text-gray-300">
            *Algunas especies pueden variar según temporada y disponibilidad.
          </p>
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}

// ---------- UI helpers ----------
function SectionWithLink({ title, href, children }) {
  return (
    <section className="scroll-mt-20 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white
                       hover:bg-emerald-700 active:scale-[0.99] transition
                       focus:outline-none focus:ring-2 focus:ring-emerald-500
                       focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Ver más
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

function CategoryCard({ icon, title, description, href, image, cta = 'Ver más' }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/90 shadow-sm
                    transition hover:shadow-md hover:-translate-y-[2px] backdrop-blur-sm
                    dark:bg-slate-900/90 dark:border-slate-700">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image?.src || '/logo_ecoatl.png'}
          alt={image?.alt || title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/85 px-3 py-1
                        text-slate-800 shadow-sm backdrop-blur-sm
                        dark:bg-slate-900/70 dark:text-slate-100">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700
                           dark:bg-emerald-900/40 dark:text-emerald-200">
            {icon}
          </span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-6">
        <p className="text-slate-700 leading-relaxed dark:text-slate-300">{description}</p>
        <div>
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 font-medium text-white
                       transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500
                       focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            {cta}
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
