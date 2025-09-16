// components/ServiciosWizard.jsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, X, PhoneCall, Images, MessageCircle } from 'lucide-react';

import galleryTree from '@/data/gallery-data.json' assert { type: 'json' };

function cx(...c) { return c.filter(Boolean).join(' '); }

/* ====== Copys extendidos para asesoría ====== */
const ADVISORY_META = [
  {
    key: 'mantenimiento',
    label: 'Mantenimiento',
    tagline: 'Recupera la claridad y el equilibrio de tu agua.',
    long:
      'Servicio integral: diagnóstico, limpieza profunda, control de algas, poda de plantas, revisión de bombas y filtros, ajuste de caudales y optimización del consumo. Ideal para estanques, BioPiscinas y ecosistemas con distinta carga orgánica.',
    bullets: [
      'Plan mensual, bimestral o estacional',
      'Bacterias benéficas y medios biológicos',
      'Lavado técnico de filtros y skimmers',
      'Reportes con evidencias (antes/después)',
    ],
  },
  {
    key: 'remodelacion',
    label: 'Remodelación',
    tagline: 'Renueva estética y desempeño con mínima obra.',
    long:
      'Actualizamos filtración, integramos cascadas y velos, rediseñamos plantado y bordes, mejoramos la iluminación y automatizamos el sistema. Transformación visible con el menor tiempo de inactividad.',
    bullets: [
      'Upgrades de filtro biológico y UV',
      'Replantado curado: oxigenadoras y florales',
      'Cascadas/velos low-noise e iluminación LED',
      'Acabados minerales y madera tratada',
    ],
  },
  {
    key: 'construccion',
    label: 'Construcción',
    tagline: 'Diseño desde cero con agua viva y eficiencia.',
    long:
      'Proyectamos y construimos Estanques, BioPiscinas y Ecosistemas Acuáticos con zonas de regeneración vegetal, bombeo eficiente y acabados naturales. Entregamos planos, manual de uso y calendario de maduración biológica.',
    bullets: [
      'Diseño bioclimático e integración paisajística',
      'Cálculo de caudales y dimensionado de filtros',
      'Zonas de plantas para regeneración del agua',
      'Garantía y acompañamiento post-entrega',
    ],
  },
];

/* ====== Tarjetas de servicios (grid) ====== */
const SERVICES = [
  {
    slug: 'estanques',
    title: 'Estanques',
    img: '/gallery/estanques.webp',
    tagline: 'Un santuario de vida en tu casa o negocio.',
    excerpt:
      'Estanques cristalinos con plantas nativas, peces y filtración biológica. Menos químicos, más vida. Diseño que refresca el microclima y eleva la experiencia del espacio.',
    bullets: [
      'Hábitat para koi, carpas y peces nativos',
      'Oxigenación, skimmers y UV opcional',
      'Paisajismo con flores y fauna útil',
    ],
  },
  {
    slug: 'biopool',
    title: 'BioPiscinas',
    img: '/gallery/biopool.webp',
    tagline: 'Nada en agua suave y natural, sin cloro agresivo.',
    excerpt:
      'BioPiscinas con zonas de regeneración vegetal y filtración de alto rendimiento. Estética natural, consumo optimizado y bienestar para la piel.',
    bullets: ['Zonas de plantas', 'Automatización y ahorro de energía', 'Acabados minerales'],
  },
  {
    slug: 'eco-aqua',
    title: 'Ecosistemas Acuáticos',
    img: '/gallery/ecosystem.webp',
    tagline: 'Cascadas, espejos y riachuelos que dan vida.',
    excerpt:
      'Creamos piezas de agua para interior/exterior: muros llorones, espejos serenos y ríos ornamentales. Integramos iluminación, niebla y sonido controlado.',
    bullets: ['Cascadas/velos low-noise', 'Borde oculto', 'Iluminación y niebla'],
  },
];

/* ====== Lectura desde el JSON del árbol de galería ====== */
function getImagesFromTree(tree, dir, { recursive = false } = {}) {
  if (!dir || !tree || typeof tree !== 'object') return [];
  const node = tree[dir];
  if (!node || typeof node !== 'object') return [];
  const out = [];
  const walk = (n) => {
    if (Array.isArray(n._files)) out.push(...n._files);
    if (recursive) {
      for (const [k, v] of Object.entries(n)) {
        if (k !== '_files' && v && typeof v === 'object') walk(v);
      }
    }
  };
  walk(node);
  out.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  return out;
}

function useFolderImages(dir, { recursive = false } = {}) {
  const [state, setState] = useState({ loading: !!dir, files: [], error: null });
  useEffect(() => {
    if (!dir) return;
    try {
      const files = getImagesFromTree(galleryTree, dir, { recursive });
      setState({ loading: false, files, error: null });
    } catch (e) {
      setState({ loading: false, files: [], error: e?.message || 'Error' });
    }
  }, [dir, recursive]);
  return state;
}

export default function ServiciosWizard({ hideIntro = false }) {
  const [choice, setChoice] = useState(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [sheetMeta, setSheetMeta] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (choice && gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [choice]);

  const openAdvisorySheet = (key) => {
    const meta = ADVISORY_META.find((a) => a.key === key);
    setSheetMeta(meta || null);
    setOpenSheet(true);
  };

  return (
    <>
      {!hideIntro && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Servicios Blue Garden</h1>
            <p className="mt-2 text-slate-300">Te ayudamos a identificar lo que necesitas y te mostramos opciones con ejemplos visuales.</p>
          </header>
        </div>
      )}

      {/* Opciones de asesoría */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mt-2 mb-3">¿Qué necesitas hoy?</h2>
        <p className="text-slate-300 mb-5">Elige una opción y conoce soluciones, ejemplos y tiempos estimados.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ADVISORY_META.map((opt) => {
            const active = choice === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => { setChoice(opt.key); openAdvisorySheet(opt.key); }}
                className={cx(
                  'rounded-2xl border p-5 text-left transition-all bg-white/5',
                  active ? 'border-sky-400 ring-1 ring-sky-300' : 'border-white/25 hover:border-white/60'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-white">{opt.label}</span>
                  <ChevronRight className="h-5 w-5 text-white/80" />
                </div>
                <p className="mt-2 text-sm text-slate-300">{opt.tagline}</p>
                <p className="mt-2 text-sm text-slate-400">{opt.long}</p>
                <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-1">
                  {opt.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>

                {/* CTA inline */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/servicios/${opt.key === 'construccion' ? 'biopool' : 'estanques'}`}
                    className="rounded-lg bg-white text-slate-900 px-3 py-2 text-sm font-medium hover:bg-slate-100"
                  >
                    Ver opciones
                  </Link>
                  <a
                    href="https://wa.me/527772568821"
                    className="inline-flex items-center gap-1 rounded-lg border border-white/30 px-3 py-2 text-sm text-white hover:bg-white/10"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de servicios */}
      <div ref={gridRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-5">Servicios</h3>
        <ul className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc) => (<ServiceCard key={svc.slug} service={svc} />))}
        </ul>
      </div>

      {/* Sheet de asesoría */}
      <AdvisorySheet open={openSheet} onClose={() => setOpenSheet(false)} meta={sheetMeta} />
    </>
  );
}

/* ====== Sheet de asesoría ====== */
function AdvisorySheet({ open, onClose, meta }) {
  const scrollerRef = useRef(null);
  const rafRef = useRef(null);
  const pauseRef = useRef(false);
  const draggingRef = useRef(false);

  const { loading, files, error } = useFolderImages(open && meta ? meta.key : null, { recursive: false });

  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (!el) return;

    const SPEED = 0.6;
    const step = () => {
      if (!pauseRef.current && !draggingRef.current) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) {
          el.scrollLeft += SPEED;
          if (el.scrollLeft >= max - 1) el.scrollLeft = 0;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    const onEnter = () => (pauseRef.current = true);
    const onLeave = () => (pauseRef.current = false);
    const onDown = () => (draggingRef.current = true);
    const onUp = () => (draggingRef.current = false);
    const onVisibility = () => (pauseRef.current = document.hidden);

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchstart', onEnter, { passive: true });
    el.addEventListener('touchend', onLeave, { passive: true });
    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseup', onUp);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchstart', onEnter);
      el.removeEventListener('touchend', onLeave);
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('mouseup', onUp);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [open]);

  if (!open || !meta) return null;

  const images = files;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 md:inset-y-10 md:right-10 md:left-auto md:w-[980px] bg-white rounded-t-2xl md:rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h5 className="font-semibold text-slate-900">{meta.label}</h5>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Cerrar">
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: carrusel */}
          <div className="relative md:h-[460px] bg-slate-50">
            <div
              ref={scrollerRef}
              className="group/scroll flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth cursor-grab h-[260px] md:h-full px-3 py-3"
            >
              {loading && <div className="flex items-center justify-center text-slate-500 text-sm px-3">Cargando fotos…</div>}
              {error && !loading && <div className="flex items-center justify-center text-red-600 text-sm px-3">Error al cargar imágenes: {error}</div>}
              {!loading && !error && images.length === 0 && <div className="flex items-center justify-center text-slate-500 text-sm px-3">No hay imágenes en esta carpeta.</div>}
              {!loading && !error && images.map((src, i) => (
                <div key={src} className="relative snap-start shrink-0 w-[min(92vw,560px)] h-full md:w-full md:h-full overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <Image src={src} alt={`${meta.label} ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 92vw, 50vw" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: contenido */}
          <div className="px-4 py-4 md:py-6">
            <p className="text-sm text-sky-700 font-medium">{meta.tagline}</p>
            <p className="mt-1 text-sm text-slate-700">{meta.long}</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
              {meta.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a href="https://wa.me/527772568821" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700">
                <MessageCircle className="h-4 w-4" /> Cotiza por WhatsApp
              </a>
              <a href="#contacto" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 text-white px-4 py-2 text-sm font-semibold hover:bg-sky-700">
                <PhoneCall className="h-4 w-4" /> Solicitar diagnóstico
              </a>
              <Link href="/gallery" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-50">
                <Images className="h-4 w-4" /> Ver más fotos
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Tiempos típicos: mantenimiento 2–4 h; remodelación 2–5 días; construcción 2–6 semanas (según escala).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====== Card de servicio (hover + scroll refinado con gradientes) ====== */
function ServiceCard({ service }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(true); // se corrige al montar/abrir

  // Actualiza indicadores de scroll cuando se abre o cambia el contenido
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const update = () => {
      setAtTop(el.scrollTop <= 1);
      setAtBottom(el.scrollHeight - el.clientHeight - el.scrollTop <= 1);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [open, service?.excerpt, service?.bullets?.length]);

  return (
    <li>
      <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white shadow-sm hover:shadow-md transition-shadow">
        {/* Imagen + trigger (tap en móvil, hover en desktop) */}
        <div
          className="relative aspect-[4/3] w-full"
          onClick={() => setOpen((v) => !v)}
          role="button"
          aria-label={`Ver descripción de ${service.title}`}
        >
          <Image
            src={service.img}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />

          {/* Overlay de fondo */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Panel principal */}
          <div
            className={cx(
              'absolute inset-x-0 bottom-0 p-4 transition-all duration-300',
              'translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
              open && 'translate-y-0 opacity-100'
            )}
            style={{ maxHeight: 'calc(100% - 0.5rem)' }} // mayor altura útil en desktop
          >
            <div className="relative rounded-xl bg-white/95 backdrop-blur-md p-4 shadow-lg pointer-events-auto flex flex-col max-h-full ring-1 ring-black/5">
              {service.tagline && (
                <p className="text-[13px] font-medium text-sky-700">{service.tagline}</p>
              )}

              {/* Área scrollable (clave: flex-1 + min-h-0) */}
              <div
                ref={bodyRef}
                className="mt-1 pr-2 flex-1 min-h-0 overflow-y-auto overscroll-contain leading-relaxed
                           max-h-56 sm:max-h-64 md:max-h-72 lg:max-h-80 xl:max-h-96"
              >
                <p className="text-sm text-slate-700">{service.excerpt}</p>
                {service.bullets?.length ? (
                  <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                    {service.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                ) : null}
              </div>

              {/* Cues de scroll: solo se muestran cuando aplica */}
              {!atTop && (
                <div className="pointer-events-none absolute left-0 right-0 top-0 h-6 rounded-t-xl bg-gradient-to-b from-white/95 to-transparent" />
              )}
              {!atBottom && (
                <div className="pointer-events-none absolute left-0 right-0 bottom-12 h-8 bg-gradient-to-t from-white/95 to-transparent" />
              )}

              <div className="mt-3">
                <Link
                  href={`/servicios/${service.slug}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  Ver más <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer card */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
            <p className="text-xs text-slate-600">Haz hover o toca para ver la ficha</p>
          </div>
          <Link href={`/servicios/${service.slug}`} className="text-sky-700 hover:text-sky-900 text-sm font-medium">
            Abrir
          </Link>
        </div>
      </div>
    </li>
  );
}
