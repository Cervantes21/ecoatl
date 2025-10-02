// app/products/plants/flotantes/flotantes/page.js
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import PlantsCategoryView from '@/components/PlantsCategoryView';

export const metadata = {
  title: 'Flotantes | Atl Ecosystem',
  description: 'Plantas flotantes para estanques, acuarios y biopiscinas.',
};

export default function FlotantesPage() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/gallery/goldfish.webp"
      >
        <source src="/Estanque_Adentro_Afuera.webm" type="video/webm" />
        Tu navegador no soporta videos en formato webm.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenido */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1 text-sm text-slate-200">
            <li><Link href="/" className="hover:text-white">Inicio</Link></li>
            <li aria-hidden="true" className="px-1"><ChevronRight className="h-4 w-4" /></li>
            <li><Link href="/products" className="hover:text-white">Productos</Link></li>
            <li aria-hidden="true" className="px-1"><ChevronRight className="h-4 w-4" /></li>
            <li><Link href="/products/plants" className="hover:text-white">Plantas</Link></li>
            <li aria-hidden="true" className="px-1"><ChevronRight className="h-4 w-4" /></li>
            <li className="text-white">Flotantes</li>
          </ol>
        </nav>

        {/* Vista de categoría */}
        <PlantsCategoryView
          categoria="Flotantes"
          onDark
          breadcrumb={[
            { label: 'Productos', href: '/products' },
            { label: 'Plantas', href: '/products/plants' },
            { label: 'Flotantes', href: '/products/plants/flotantes' },
            { label: 'Flotantes' },
          ]}
        />
      </div>
    </section>
  );
}
