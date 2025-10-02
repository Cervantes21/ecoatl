// components/ServiceGrid.jsx
'use client';

import Link from 'next/link';
import ServiceCard from './ServiceCard';
import { FaWater, FaLeaf, FaFish, FaSpa } from 'react-icons/fa';

export default function ServiceGrid() {
  const services = [
    {
      title: "Estanques Naturales",
      description: "Diseño e instalación de estanques para jardines",
      icon: <FaWater />,
      link: "/servicios/estanques"
    },
    {
      title: "Plantas Acuáticas",
      description: "Venta de especies criadas por nosotros",
      icon: <FaLeaf />,
      link: "/products/plants"
    },
    {
      title: "Bio-piscinas",
      description: "Piscinas naturales sin químicos",
      icon: <FaSpa />,
      link: "/servicios/biopool"
    },
    {
      title: "Peces Sanos",
      description: "Cría y venta de peces ornamentales",
      icon: <FaFish />,
      link: "/products/fish"
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Texto principal */}
        <h2 className="text-4xl md:text-5xl font-bold text-green-600 text-center mb-4">
          Diseño de Estanques y Acuapaisajismo
        </h2>
        <p className="text-lg md:text-xl text-blue-700 text-center mb-12">
          Creamos espacios acuáticos vivos con plantas criadas por nosotros y peces saludables.
        </p>

        {/* Grid de servicios */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s, idx) => (
            <Link key={idx} href={s.link} className="block hover:scale-105 transition-transform duration-200">
              <ServiceCard {...s} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
