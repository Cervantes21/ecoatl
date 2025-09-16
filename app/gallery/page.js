// app/gallery/page.js
import ProjectShowcase from '@/components/ProjectShowcase';
import Link from 'next/link';
import Image from 'next/image';
import { FaLeaf, FaFish } from 'react-icons/fa';
import { ChevronRight } from 'lucide-react';
import ContactCTA from '@/components/ContactCTA.jsx';
import GalleryGrid from '@/components/GalleryGrid.jsx';

export const metadata = {
  title: 'Galería | Blue Garden',
  description:
    'Explora proyectos de Blue Garden: antes y después, características y testimonios. Además, visita nuestras galerías de plantas y peces.',
};

const PROJECTS = [
  {
    id: 'project1',
    title: 'Estanque ecológico residencial',
    location: 'Cuernavaca, Morelos',
    date: 'Agosto 2023',
    summary:
      'Diseño de estanque con filtración natural y plantado palustre para favorecer biodiversidad.',
    features: [
      'Filtro biológico con grava y plantas',
      'Circulación silenciosa de bajo consumo',
      'Roca volcánica local y borde natural',
      'Refugios para fauna benéfica',
    ],
    testimonial: {
      comment:
        'El estanque superó nuestras expectativas. ¡Tenemos un ecosistema completo en casa!',
      author: 'Cliente Satisfecho',
      date: 'Agosto 2023',
    },
    images: [
      { src: '/gallery/testimonials/project1/before.webp', alt: 'Antes - patio' },
      { src: '/gallery/testimonials/project1/after.webp', alt: 'Después - estanque' },
    ],
  },
  {
    id: 'project2',
    title: 'Bio-piscina familiar',
    location: 'CDMX, México',
    date: 'Mayo 2024',
    summary:
      'Conversión de alberca tradicional a bio-piscina con zona de regeneración y filtración vegetal.',
    features: [
      'Zona de nado + zona de plantas',
      'Skimmer discreto, sin ruidos',
      'Iluminación cálida nocturna',
      'Mantenimiento simplificado',
    ],
    testimonial: {
      comment: 'La bio-piscina cambió por completo nuestro espacio. ¡Es increíble!',
      author: 'Familia Pérez',
      date: 'Mayo 2024',
    },
    images: [
      { src: '/gallery/testimonials/project2/before.webp', alt: 'Antes - alberca' },
      { src: '/gallery/testimonials/project2/after.webp', alt: 'Después - bio-piscina' },
    ],
  },
  {
    id: 'project3',
    title: 'Estanque estilo ecobrutalista',
    location: 'Toluca, Estado de México',
    date: 'Enero 2025',
    summary: 'Concreto aparente con vegetación acuática y caída de agua focal.',
    features: [
      'Geometría limpia y materiales honestos',
      'Oxigenación por cascada',
      'Palustres de bajo mantenimiento',
      'Vistas especulares controladas',
    ],
    testimonial: {
      comment: 'Estilo único. ¡Todos lo admiran!',
      author: 'Jardín Botánico',
      date: 'Enero 2025',
    },
    images: [
      { src: '/gallery/testimonials/project3/before.webp', alt: 'Antes - obra gris' },
      { src: '/gallery/testimonials/project3/after.webp', alt: 'Después - terminado' },
    ],
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Proyectos en carrusel/fichas */}
      <ProjectShowcase projects={PROJECTS} />
      <GalleryGrid/>
      {/* Sección CTA a galerías con video de fondo */}
      <section className="relative py-14 overflow-hidden">
        {/* Video de fondo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover z-0"
        >
          <source src="/Estanque_Adentro_Afuera.webm" type="video/webm" />
        </video>

        {/* Capa oscura para legibilidad */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Contenido */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Sumérgete en nuestras galerías
            </h2>
            <p className="mt-3 text-lg text-gray-200">
            Explora ejemplos de especies y variedades que usamos en los proyectos.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <CategoryCard
              icon={<FaLeaf className="h-7 w-7" aria-hidden="true" />}
              title="Galería de plantas"
              href="/products/plants"
              description="Oxigenadoras, flotantes, palustres y tapizantes para lograr un equilibrio saludable."
              image={{
                src: '/gallery/plantas-acuaticas.webp',
                alt: 'Plantas acuáticas Blue Garden',
              }}
              cta="Ver plantas"
            />
            <CategoryCard
              icon={<FaFish className="h-7 w-7" aria-hidden="true" />}
              title="Galería de peces"
              href="/products/fish"
              description="Koi, goldfish y especies compatibles para estanques y acuarios."
              image={{
                src: '/gallery/koi-fish.webp',
                alt: 'Peces para estanques y acuarios',
              }}
              cta="Ver peces"
            />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-gray-300">
            *Algunas especies pueden variar según temporada y disponibilidad.
          </p>
        </div>
      </section>

      {/* Contacto final */}
      <ContactCTA />
    </main>
  );
}

function CategoryCard({ icon, title, description, href, image, cta = 'Ver más' }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/30 bg-white/90 shadow-sm transition hover:shadow-md backdrop-blur-sm dark:bg-slate-900/90 dark:border-slate-700">
      {/* Cabecera con imagen */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image?.src || '/logo_blue-garden.webp'}
          alt={image?.alt || title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-slate-800 backdrop-blur-sm dark:bg-slate-900/70 dark:text-slate-100">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
            {icon}
          </span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-col gap-5 p-6">
        <p className="text-slate-700 dark:text-slate-300">{description}</p>
        <div>
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            {cta}
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
