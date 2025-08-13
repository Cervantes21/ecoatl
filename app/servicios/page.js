// app/servicios/page.js
import ServiciosWizard from '@/components/ServiciosWizard';
import Link from 'next/link';

export const metadata = {
  title: 'Servicios | Blue Garden',
  description:
    'Estanques, BioPiscinas y Ecosistemas Acuáticos. Más de 12 años creando agua viva: diseño, construcción, remodelación y mantenimiento.',
};

export default function ServiciosPage() {
  return (
    <main className="relative min-h-screen pt-20 md:pt-24">
      {/* Video de fondo */}
      <video
        src="/estanque.webm"
        poster="/gallery/IMG_20210525_153434.webp"
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
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              Estanques
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              BioPiscinas
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              Ecosistemas Acuáticos
            </span>

            <div className="h-4 w-px bg-white/20 mx-1" />

            <a
              href="https://wa.me/5210000000000"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              Cotiza por WhatsApp
            </a>
            <Link
              href="/gallery"
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white text-sm font-semibold hover:bg-white/20"
            >
              Ver portafolio
            </Link>
          </div>
        </div>
      </section>

      {/* Generador de ventas (wizard) – intro oculta para no repetir el H1 */}
      <ServiciosWizard hideIntro />

      {/* CTA inferior */}
      <section className="border-t border-white/10 bg-black/30 py-8">
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
                href="https://wa.me/5210000000000"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700"
              >
                Cotizar ahora
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-white font-medium hover:bg-sky-700"
              >
                Solicitar diagnóstico
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
