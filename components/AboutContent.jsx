// components/AboutContent.jsx
import Link from 'next/link';
import Image from 'next/image';
import {
  Leaf, Wrench, ShieldCheck, Sparkles,
  Droplets, Timer, Hammer,
} from 'lucide-react';

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-sm text-white/80">{label}</p>
    </div>
  );
}

function ValueCard({ Icon, title, desc }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-sky-50 p-2.5 border border-sky-100">
          <Icon className="h-5 w-5 text-sky-700" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <p className="mt-1 text-sm text-slate-600">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Step({ i, title, desc }) {
  return (
    <li className="flex items-start gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white font-semibold">
        {i}
      </div>
      <div>
        <h5 className="font-semibold text-white">{title}</h5>
        <p className="text-sm text-slate-200 mt-1">{desc}</p>
      </div>
    </li>
  );
}

const TESTIMONIAL_IDS = ['project1', 'project2', 'project3', 'project4'];
const testimonialImages = TESTIMONIAL_IDS.flatMap((id) => [
  `/gallery/testimonials/${id}/before.webp`,
  `/gallery/testimonials/${id}/after.webp`,
]);

export default function AboutContent() {
  return (
    <>
      {/* HERO (el video viene desde la page) */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-wider text-sky-300 font-semibold">
            Sobre nosotros
          </p>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-white">
            Blue Garden
          </h1>

          {/* Texto actualizado */}
          <p className="mt-4 max-w-3xl text-slate-200 leading-relaxed">
            Desde hace más de <strong>12 años</strong> diseñamos y construimos
            <strong> sistemas acuáticos naturales</strong>:
            <span className="whitespace-nowrap"> Estanques</span>, <span className="whitespace-nowrap">BioPiscinas</span> y
            <span className="whitespace-nowrap"> Ecosistemas Acuáticos</span> que se mantienen
            <strong> claros y estables</strong> gracias a filtración biológica y automatización.
            Unimos <strong>ingeniería</strong> y <strong>oficio artesanal</strong> para crear espacios
            hermosos, eficientes y de <strong>bajo mantenimiento</strong>.
          </p>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            <Stat value="+12 años" label="de experiencia" />
            <Stat value="+150" label="proyectos entregados" />
            <Stat value="3 líneas" label="Estanques · BioPiscinas · Ecosistemas" />
            <Stat value="Bajo mantto." label="filtración biológica y automatización" />
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/527772568821"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              Cotiza por WhatsApp
            </a>
            <Link
              href="/servicios"
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white text-sm font-semibold hover:bg-white/20"
            >
              Ver servicios
            </Link>
            <Link
              href="/gallery"
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white text-sm font-semibold hover:bg-white/20"
            >
              Portafolio
            </Link>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-black/30 backdrop-blur-[1px] border-t border-white/10 py-10 mt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Nuestra esencia</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ValueCard
              Icon={Leaf}
              title="Sostenibilidad real"
              desc="Filtración biológica, consumo optimizado y especies nativas. Más vida, menos químicos."
            />
            <ValueCard
              Icon={Wrench}
              title="Ingeniería + detalle"
              desc="Dimensionado de caudales, selección de medios y acabados artesanales que perduran."
            />
            <ValueCard
              Icon={ShieldCheck}
              title="Acompañamiento continuo"
              desc="Planes de mantenimiento y garantía. Diagnóstico y soporte técnico post-entrega."
            />
            <ValueCard
              Icon={Sparkles}
              title="Estética natural"
              desc="Diseños integrados al lugar: texturas minerales, madera y vegetación que maduran."
            />
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Cómo trabajamos</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <ul className="space-y-5">
              <Step
                i={1}
                title="Diagnóstico"
                desc="Visita o videollamada para entender el sitio, objetivos, presupuesto y estilo."
              />
              <Step
                i={2}
                title="Propuesta clara"
                desc="Concepto, alcance, cronograma y presupuesto. Opciones escalables para decidir."
              />
              <Step
                i={3}
                title="Construcción / Remodelación"
                desc="Ejecución por etapas: obra civil ligera, filtración, paisajismo e integración eléctrica/hidráulica."
              />
              <Step
                i={4}
                title="Acompañamiento"
                desc="Puesta en marcha, guía de uso y calendario de maduración biológica. Planes de mantenimiento."
              />
            </ul>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">¿Listo para comenzar?</h3>
              <p className="mt-2 text-slate-700">
                Agenda una evaluación sin costo y recibe una propuesta con tiempos y alcances.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="https://wa.me/527772568821"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700"
                >
                  <Droplets className="h-4 w-4" />
                  Hablar por WhatsApp
                </a>
                <Link
                  href="/servicios"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 text-sm font-semibold hover:bg-slate-50"
                >
                  <Hammer className="h-4 w-4" />
                  Ver servicios
                </Link>
                <Link
                  href="#contacto"
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-white text-sm font-semibold hover:bg-sky-700"
                >
                  <Timer className="h-4 w-4" />
                  Solicitar diagnóstico
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mini-galería */}
      <section className="bg-black/30 backdrop-blur-[1px] border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Antes y después</h2>
            <Link
              href="/gallery"
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white text-sm font-semibold hover:bg-white/20"
            >
              Ver portafolio
            </Link>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {testimonialImages.map((src, i) => (
              <li key={i} className="overflow-hidden rounded-2xl border border-white/15 bg-white/5">
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
      </section>

      {/* Cierre/CTA */}
      <section className="py-10 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Creamos paisajes con agua, naturales y eficientes.
              </h3>
              <p className="text-slate-700">
                Escríbenos y te ayudamos a decidir la mejor solución para tu espacio.
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="https://wa.me/527772568821"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                Cotiza por WhatsApp
              </a>
              <Link
                href="/servicios"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 text-sm font-semibold hover:bg-slate-50"
              >
                Ver servicios
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
