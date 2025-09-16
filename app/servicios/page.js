// app/servicios/page.js
import Link from 'next/link';
import ServiciosWizard from '@/components/ServiciosWizard';
import BeforeAfterGrid from '@/components/BeforeAfterGrid';
import {
  Droplets, Leaf, ShieldCheck, Wrench, Timer, MapPin, Wallet,
  Sparkles, Recycle, ThermometerSun, Waves, BadgeCheck, PhoneCall
} from 'lucide-react';

export const metadata = {
  title: 'Servicios | Blue Garden',
  description:
    'Estanques, BioPiscinas y Ecosistemas Acuáticos. Más de 12 años creando agua viva: diseño, construcción, remodelación y mantenimiento.',
};

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-4 text-center">
      <div className="text-2xl md:text-3xl font-extrabold text-white">{value}</div>
      <div className="mt-1 text-xs text-white/80">{label}</div>
    </div>
  );
}

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

export default function ServiciosPage() {
  const faq = [
    {
      q: '¿Qué mantenimiento requiere un estanque o BioPiscina?',
      a: 'Diseñamos para bajo mantenimiento: poda ligera, revisión de bombas y limpieza de pre-filtros. Con filtración biológica madura y plantas correctas, las intervenciones son breves y programadas.'
    },
    {
      q: '¿El agua queda cristalina sin químicos?',
      a: 'Sí. Usamos biofiltración (bacterias nitrificantes), plantas macrófitas y una hidráulica bien calculada. Podemos usar apoyo UV o pulidores cuando el contexto lo exige, sin depender de cloro.'
    },
    {
      q: '¿En cuánto tiempo está listo?',
      a: 'Obra civil + instalación suele tomar 5–15 días según el tamaño. La madurez biológica alcanza estabilidad visible entre las semanas 3 y 8 con el plan de arranque que implementamos.'
    },
    {
      q: '¿Dan garantía?',
      a: 'Sí. Garantía por instalación y equipos (según fabricante), además de acompañamiento en la curva de arranque. Incluye visita de ajuste y guía de buenas prácticas.'
    },
    {
      q: '¿Dónde trabajan?',
      a: 'Morelos y CDMX como cobertura base. También hacemos proyectos especiales en estados aledaños previa agenda y evaluación logística.'
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
    <main className="relative min-h-screen pt-20 md:pt-24">
      {/* Video de fondo */}
      <video
        src="/estanque.webm"
        poster="/gallery/goldfish.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="fixed inset-0 -z-10 w-full h-full object-cover pointer-events-none"
        aria-hidden
      />
      {/* Overlay para contraste */}
      <div className="fixed inset-0 -z-10 bg-black/55" aria-hidden />

      {/* Encabezado narrativo */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-4">
          <p className="text-sm uppercase tracking-wider text-sky-300 font-semibold">
            Asesoría guiada
          </p>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-white">
            Servicios Blue Garden
          </h1>

          <p className="mt-4 text-slate-200 max-w-3xl leading-relaxed">
            Contamos con <strong>más de 12 años</strong> creando y cuidando <em>agua viva</em>:
            <span className="whitespace-nowrap"> Estanques</span>, <span className="whitespace-nowrap">BioPiscinas</span> y
            <span className="whitespace-nowrap"> Ecosistemas Acuáticos</span> que refrescan el microclima, atraen vida y se
            mantienen claros con bajo consumo. Integramos <strong>filtración biológica</strong>, diseño eco-brutalista y
            <strong> automatización</strong> para lograr estética natural, estabilidad y <strong>bajo mantenimiento</strong>.
            Atendemos proyectos nuevos, mejoras y planes de servicio continuos.
          </p>

          {/* Chips + CTAs */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">Estanques</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">BioPiscinas</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">Ecosistemas Acuáticos</span>

            <div className="h-4 w-px bg-white/20 mx-1" />

            <a
              href="https://wa.me/527772568821"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700 inline-flex items-center gap-2"
            >
              <PhoneCall className="h-4 w-4" />
              Cotiza por WhatsApp
            </a>
            <Link
              href="/gallery"
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white text-sm font-semibold hover:bg-white/20"
            >
              Ver portafolio
            </Link>
          </div>

          {/* Métricas rápidas */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            <Stat value="+12 años" label="Experiencia especializada" />
            <Stat value="100% bio" label="Filtración biológica" />
            <Stat value="Bajo consumo" label="Hidráulica optimizada" />
            <Stat value="Garantía" label="Instalación y equipos" />
          </div>
        </div>
      </section>

      {/* Antes / Después */}
      <BeforeAfterGrid maxItems={8} intervalMs={3200} />

      {/* Por qué Blue Garden */}
      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">¿Por qué Blue Garden?</h2>
          <p className="mt-2 text-white/80 max-w-3xl">
            Diseñamos sistemas vivos que se estabilizan por sí mismos. Cada proyecto equilibra estética,
            biología y eficiencia energética para que disfrutes agua clara y saludable todo el año.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature Icon={Droplets} title="Agua cristalina" desc="Ciclos cerrados de nitrógeno con bacterias nitrificantes y pulido fino según el caso." />
            <Feature Icon={Leaf} title="Paisajismo funcional" desc="Plantas macrófitas que embellecen y consumen nutrientes, controlando algas de forma natural." />
            <Feature Icon={Wrench} title="Ingeniería cuidada" desc="Cálculo de caudales, pérdidas de carga y retorno laminar para bajo consumo y ruido." />
            <Feature Icon={ThermometerSun} title="Estabilidad térmica" desc="Sombreados, profundidad y materiales que reducen picos de temperatura." />
            <Feature Icon={Recycle} title="Bajo mantenimiento" desc="Prefiltros accesibles, válvulas de purga y automatización donde aporta valor." />
            <Feature Icon={ShieldCheck} title="Seguridad & garantía" desc="Instalación profesional y equipos con respaldo de fabricante." />
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="relative py-10 border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">¿Qué incluye un proyecto?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-300" /> Diseño & ingeniería
              </h3>
              <ul className="mt-3 space-y-2 text-white/80 text-sm list-disc pl-5">
                <li>Concepto eco-brutalista, selección de materiales y acabados.</li>
                <li>Plano de hidráulica: succión, retorno, pre-filtros y biofiltros.</li>
                <li>Dimensionamiento de bombas, UV y lechos filtrantes.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Wrench className="h-5 w-5 text-emerald-300" /> Construcción & instalación
              </h3>
              <ul className="mt-3 space-y-2 text-white/80 text-sm list-disc pl-5">
                <li>Obra civil, sellos, impermeabilización o liner según solución.</li>
                <li>Instalación eléctrica segura y automatización básica.</li>
                <li>Plantación, ciclado biológico y puesta a punto.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-emerald-300" /> Garantía & acompañamiento
              </h3>
              <ul className="mt-3 space-y-2 text-white/80 text-sm list-disc pl-5">
                <li>Garantía por instalación + garantías de fabricante en equipos.</li>
                <li>Visita de ajuste durante el arranque biológico.</li>
                <li>Manual de buenas prácticas y calendario de cuidados.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-300" /> Opciones de inversión
              </h3>
              <ul className="mt-3 space-y-2 text-white/80 text-sm list-disc pl-5">
                <li>Etapas por fases para ajustarse a tu presupuesto.</li>
                <li>Actualizaciones modulares (UV, pulidores, automatización).</li>
                <li>Planes de servicio con tarifa preferente.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Metodología en 5 pasos */}
      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Metodología en 5 pasos</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-5">
              <Step number="1" title="Diagnóstico y objetivos"
                desc="Levantamiento del sitio, expectativas de uso (ornamental, nado, contemplativo) y restricciones técnicas." />
              <Step number="2" title="Anteproyecto & cotización"
                desc="Propuesta con alcances, materiales, cronograma y presupuesto por fases." />
              <Step number="3" title="Construcción e instalación"
                desc="Obra limpia, montaje hidráulico y eléctrico, pruebas de estanqueidad y caudal." />
              <Step number="4" title="Plantación & ciclado"
                desc="Selección de especies, inoculación bacteriana y estabilización de parámetros." />
              <Step number="5" title="Arranque acompañado"
                desc="Visita de ajuste, manual de operación y calendario de mantenimiento." />
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
                <Waves className="h-5 w-5 text-emerald-300" /> Requisitos del sitio
              </h3>
              <ul className="mt-3 space-y-2 text-white/80 text-sm list-disc pl-5">
                <li>Alimentación eléctrica estable y tierra física.</li>
                <li>Drenaje o punto de desagüe para purgas.</li>
                <li>Zona para biofiltros/prefiltros con acceso seguro.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Planes de mantenimiento */}
      <section className="relative py-10 border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Planes de mantenimiento</h2>
          <p className="mt-2 text-white/80 max-w-3xl">
            Diseñados para conservar claridad y salud con visitas breves y programadas.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">Esencial</h3>
              <p className="text-slate-600 text-sm mt-1">Mensual</p>
              <ul className="mt-3 text-sm text-slate-700 space-y-2 list-disc pl-5">
                <li>Revisión de parámetros clave.</li>
                <li>Limpieza de pre-filtros y purgas.</li>
                <li>Poda ligera y control de algas.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-2 ring-emerald-500">
              <h3 className="font-semibold text-slate-900">Óptimo</h3>
              <p className="text-slate-600 text-sm mt-1">Quincenal</p>
              <ul className="mt-3 text-sm text-slate-700 space-y-2 list-disc pl-5">
                <li>Mantenimiento preventivo de bombas y UV.</li>
                <li>Balance fino de nutrientes y plantas.</li>
                <li>Soporte en arranque y cambios estacionales.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">Intensivo</h3>
              <p className="text-slate-600 text-sm mt-1">Semanal</p>
              <ul className="mt-3 text-sm text-slate-700 space-y-2 list-disc pl-5">
                <li>Para BioPiscinas de alto uso.</li>
                <li>Optimización continua de claridad.</li>
                <li>Atención prioritaria.</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://wa.me/527772568821"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              Cotizar plan
            </a>
            <Link
              href="/contact"
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white text-sm font-semibold hover:bg-white/20"
            >
              Hablar con un asesor
            </Link>
          </div>
        </div>
      </section>

      {/* Cobertura */}
      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Cobertura</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <div className="flex items-center gap-2 text-white font-semibold">
                <MapPin className="h-5 w-5 text-emerald-300" />
                Base Morelos
              </div>
              <p className="mt-2 text-white/80 text-sm">Cuernavaca Centro y Norte, y municipios colindantes.</p>
            </div>
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <div className="flex items-center gap-2 text-white font-semibold">
                <MapPin className="h-5 w-5 text-emerald-300" />
                CDMX
              </div>
              <p className="mt-2 text-white/80 text-sm">Proyectos y mantenimiento programado.</p>
            </div>
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
              <div className="flex items-center gap-2 text-white font-semibold">
                <MapPin className="h-5 w-5 text-emerald-300" />
                Foráneos
              </div>
              <p className="mt-2 text-white/80 text-sm">Estados aledaños por agenda y evaluación logística.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Generador de ventas (wizard) – intro oculta para no repetir el H1 */}
      <ServiciosWizard hideIntro />

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

      {/* CTA inferior */}
      <section className="border-t border-white/10 bg-black/30 py-8" id="contacto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">¿Listo para comenzar?</h3>
              <p className="text-slate-700">
                Agenda un diagnóstico y recibe una propuesta clara con tiempos y alcances.
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="https://wa.me/527772568821"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700"
              >
                Cotizar ahora
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-white font-medium hover:bg-sky-700"
              >
                Solicitar diagnóstico
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD FAQPage para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
