// app/products/plants/page.js
import Link from 'next/link';
import PlantsGallery from '@/components/PlantsGallery.jsx';
import { ChevronRight } from 'lucide-react';
import { PLANT_CATEGORIES, slugify, getCategoryBySlug } from '@/utils/plantsRouting';

export const metadata = {
  title: 'Plantas acuáticas | Blue Garden',
  description:
    'Explora plantas oxigenadoras, flotantes, palustres, nenúfares y colocasias para estanques, acuarios y biopiscinas.',
};

export default function PlantsPage({ searchParams }) {
  const catSlug = slugify((searchParams?.cat || '').toString());
  const selected = getCategoryBySlug(catSlug); // { label, href } | null

  const chips = PLANT_CATEGORIES.map((c) => ({
    label: c.label,
    href: `/products/plants?cat=${encodeURIComponent(slugify(c.label))}`,
    isActive: slugify(c.label) === catSlug && catSlug !== '',
  }));

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/gallery/IMG_20210525_153434.webp"
      >
        <source src="/Estanque_Adentro_Afuera.webm" type="video/webm" />
        Tu navegador no soporta videos en formato webm.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="w-full max-w-7xl mx-auto mb-4">
          <ol className="flex items-center gap-1 text-sm text-slate-200">
            <li>
              <Link href="/" className="hover:text-white">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true" className="px-1">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li>
              <Link href="/products" className="hover:text-white">
                Productos
              </Link>
            </li>
            <li aria-hidden="true" className="px-1">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li className="text-white">Plantas</li>
          </ol>
        </nav>

        {/* Título general */}
        <header className="max-w-3xl mb-3 mt-8 sm:mt-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
            Plantas acuáticas
          </h1>
          <p className="mt-2 text-lg text-slate-200 drop-shadow">
            Catálogo por categorías: oxigenadoras, flotantes, palustres, nenúfares y colocasias.
          </p>
        </header>

        {/* Título de selección (link a la ruta de la categoría) */}
        {selected && (
          <div className="mb-4">
            <Link
              href={selected.href}
              className="inline-block text-xl sm:text-2xl font-semibold text-white underline decoration-fuchsia-400/60 underline-offset-4 hover:decoration-fuchsia-300"
            >
              {selected.label}
            </Link>
          </div>
        )}

        {/* Chips */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {chips.map((chip) => (
            <Link
              key={chip.href}
              href={chip.href}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                chip.isActive
                  ? 'bg-fuchsia-600 text-white border-fuchsia-600'
                  : 'border-white text-white hover:bg-white/20'
              }`}
            >
              {chip.label}
            </Link>
          ))}
        </div>

        {/* Galería */}
        <div className="w-full max-w-7xl">
          <PlantsGallery
            initialCategorySlug={catSlug} 
            showTabs={false}
            showHeading={false}
            showSearch={true}
            className="bg-white/80 backdrop-blur-lg rounded-2xl p-4"
          />
        </div>
      </div>
    </section>
  );
}
