'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronRight, X, PhoneCall, Images, MessageCircle } from 'lucide-react';

function cx(...c) { return c.filter(Boolean).join(' '); }

/* ====== Imágenes de cada ficha (según tu árbol actual) ====== */
const MANT_IMGS = [
  '20180810_162125.webp',
  '20180814_155509.webp',
  '476848771_2385917241762855_5036919680159802796_n.webp',
];
const REMO_IMGS = [
  '20180810_162125.webp',
  '20180814_155509.webp',
  '476848771_2385917241762855_5036919680159802796_n.webp',
];
const CONS_IMGS = [
  '20180810_162125.webp',
  '20180814_155509.webp',
  '476848771_2385917241762855_5036919680159802796_n.webp',
];

/* ====== Copys extendidos para asesoría ====== */
const ADVISORY = [
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
    imgs: MANT_IMGS,
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
    imgs: REMO_IMGS,
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
    imgs: CONS_IMGS,
  },
];

/* ====== Tarjetas de servicios (grid) ====== */
const SERVICES = [
  {
    slug: 'estanques',
    title: 'Estanques',
    img: '/gallery/IMG_20210525_153434.webp',
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
    img: '/gallery/IMG_20210525_153446.webp',
    tagline: 'Cascadas, espejos y riachuelos que dan vida.',
    excerpt:
      'Creamos piezas de agua para interior/exterior: muros llorones, espejos serenos y ríos ornamentales. Integramos iluminación, niebla y sonido controlado.',
    bullets: ['Cascadas/velos low-noise', 'Borde oculto', 'Iluminación y niebla'],
  },
];

/* ====== Mini-galería (antes/después) ====== */
const TESTIMONIAL_IDS = ['project1', 'project2', 'project3', 'project4'];
function getTestimonialImages() {
  const out = [];
  for (const id of TESTIMONIAL_IDS) {
    out.push(`/gallery/testimonials/${id}/before.webp`);
    out.push(`/gallery/testimonials/${id}/after.webp`);
  }
  return out;
}

export default function ServiciosWizard({ hideIntro = false }) {
  const [choice, setChoice] = useState(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [sheetData, setSheetData] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (choice && gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [choice]);

  const openAdvisorySheet = (key) => {
    const data = ADVISORY.find((a) => a.key === key);
    setSheetData(data || null);
    setOpenSheet(true);
  };

  return (
    <>
      {/* Intro del wizard (opcional para no duplicar H1) */}
      {!hideIntro && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Servicios Blue Garden</h1>
            <p className="mt-2 text-slate-300">
              Te ayudamos a identificar lo que necesitas y te mostramos opciones con ejemplos visuales.
            </p>
          </header>
        </div>
      )}

      {/* Generador de ventas */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mt-2 mb-3">¿Qué necesitas hoy?</h2>
        <p className="text-slate-300 mb-5">Elige una opción y conoce soluciones, ejemplos y tiempos estimados.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ADVISORY.map((opt) => {
            const active = choice === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => {
                  setChoice(opt.key);
                  openAdvisorySheet(opt.key);
                }}
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
                <p className="mt-2 text-sm text-slate-400 line-clamp-3">{opt.long}</p>
                <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-1">
                  {opt.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>

                {/* CTA inline */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/servicios/${opt.key === 'construccion' ? 'biopool' : 'estanques'}`}
                        className="rounded-lg bg-white text-slate-900 px-3 py-2 text-sm font-medium hover:bg-slate-100">
                    Ver opciones
                  </Link>
                  <a href="https://wa.me/5210000000000"
                     className="inline-flex items-center gap-1 rounded-lg border border-white/30 px-3 py-2 text-sm text-white hover:bg-white/10">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grilla de servicios */}
      <div ref={gridRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-5">Servicios</h3>
        <ul className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((svc) => (
            <ServiceCard key={svc.slug} service={svc} />
          ))}
        </ul>
      </div>

      {/* Mini-galería */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-2xl font-semibold text-white">Antes y Después</h4>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-3 py-2 text-sm font-medium hover:bg-slate-100 transition"
          >
            <Images className="h-4 w-4" />
            Ver más fotos
          </Link>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {getTestimonialImages().map((src, i) => (
            <li key={i} className="overflow-hidden rounded-2xl border border-white/20 bg-white/5">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={src}
                  alt={`Testimonial ${i + 1}`}
                  fill
                  className="object-cover hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal/Sheet de la asesoría */}
      <AdvisorySheet
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        data={sheetData}
      />
    </>
  );
}

/* ====== Sheet: imágenes a la izquierda con drag-to-scroll + autoplay ====== */
function AdvisorySheet({ open, onClose, data }) {
  const scrollerRef = useRef(null);
  const rafRef = useRef(null);
  const pauseRef = useRef(false);
  const draggingRef = useRef(false);

  // Autoscroll loop
  useEffect(() => {
    if (!open) return;

    const el = scrollerRef.current;
    if (!el) return;

    const SPEED = 0.6; // px por frame aprox. (≈36px/s)
    const step = () => {
      if (!pauseRef.current && !draggingRef.current) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) {
          el.scrollLeft = el.scrollLeft + SPEED;
          if (el.scrollLeft >= max - 1) el.scrollLeft = 0; // loop
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

  // Drag to scroll con mouse (touch ya funciona nativo)
  useEffect(() => {
    if (!open || !scrollerRef.current) return;
    const el = scrollerRef.current;
    let isDown = false, startX = 0, scrollStart = 0;

    const onMouseDown = (e) => {
      isDown = true; draggingRef.current = true;
      el.classList.add('cursor-grabbing');
      startX = e.pageX - el.offsetLeft;
      scrollStart = el.scrollLeft;
    };
    const end = () => {
      isDown = false; draggingRef.current = false;
      el.classList.remove('cursor-grabbing');
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollStart - (x - startX);
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', end);
    el.addEventListener('mouseup', end);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', end);
      el.removeEventListener('mouseup', end);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, [open]);

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-x-0 bottom-0 md:inset-y-10 md:right-10 md:left-auto md:w-[980px] bg-white rounded-t-2xl md:rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h5 className="font-semibold text-slate-900">{data.label}</h5>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        {/* Two-panel layout */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: carrusel arrastrable + autoplay */}
          <div className="relative md:h-[460px] bg-slate-50">
            {/* Bisel de guía de scroll */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent z-10 hidden md:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent z-10 hidden md:block" />

            <div
              ref={scrollerRef}
              className="group/scroll flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth cursor-grab h-[260px] md:h-full px-3 py-3"
            >
              {(data.imgs || []).map((name, i) => (
                <div
                  key={i}
                  className="relative snap-start shrink-0 w-[min(92vw,560px)] h-full md:w-full md:h-full overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <Image
                    src={`/gallery/${data.key}/${name}`}
                    alt={`${data.label} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 92vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: contenido y CTAs */}
          <div className="px-4 py-4 md:py-6">
            <p className="text-sm text-sky-700 font-medium">{data.tagline}</p>
            <p className="mt-1 text-sm text-slate-700">{data.long}</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
              {data.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href="https://wa.me/5210000000000"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" />
                Cotiza por WhatsApp
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 text-white px-4 py-2 text-sm font-semibold hover:bg-sky-700"
              >
                <PhoneCall className="h-4 w-4" />
                Solicitar diagnóstico
              </a>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <Images className="h-4 w-4" />
                Ver más fotos
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

/* ====== Card de servicio ====== */
function ServiceCard({ service }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={service.img}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Ver descripción de ${service.title}`}
          />
          <div className={cx(
            'absolute inset-x-0 bottom-0 p-4 transition-all',
            'translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
            open && 'translate-y-0 opacity-100'
          )}>
            <div className="rounded-xl bg-white/95 backdrop-blur p-4 shadow">
              {service.tagline && <p className="text-[13px] font-medium text-sky-700">{service.tagline}</p>}
              <p className="mt-1 text-sm text-slate-700">{service.excerpt}</p>
              {service.bullets?.length ? (
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {service.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              ) : null}
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
