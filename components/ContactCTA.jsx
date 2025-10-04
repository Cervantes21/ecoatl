// components/ContactCTA.jsx
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle, ArrowRight } from "lucide-react";

const LOCATIONS = [
  {
    nombre: "Blue Garden Cuernavaca Norte",
    direccion: "Patzcuaro 5, Lomas de Atzingo, 62180 Cuernavaca, Mor.",
    telefono: "777 256 88 21",
    telHref: "tel:+527772568821",
    whatsapp: "https://wa.me/527772568821",
    email: "bluegarden357@gmail.com",
    maps: "https://share.google/46wwBUOGblAgqbwlW",
  },
  {
    nombre: "Eco-Atl, Atl-Ecosystem Centro",
    direccion:
      "Calle Gral. H. Galeana 46, Cuernavaca Centro, Centro, 62000 Cuernavaca, Mor.",
    telefono: "777 256 88 21",
    telHref: "tel:+527772568821",
    whatsapp: "https://wa.me/527772568821",
    email: "atl.ecosystem@gmail.com",
    maps: "https://maps.app.goo.gl/W1MEdCESj4jnRiry9",
  },
  {
    nombre: "Blue Garden Riviera Maya",
    direccion: "Playa del Carmen",
    telefono: "777 377 9679",
    telHref: "tel:+52777379679",
    whatsapp: "https://wa.me/52777379679",
    email: "bluegarden357@gmail.com",

  },
];

export default function ContactCTA() {
  return (
    <section id="contact" className="relative py-20 bg-teal-900 text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Encabezado */}
        <header className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            ¿Listo para transformar tu jardín?
          </h2>
          <p className="mt-3 text-base md:text-lg text-white/90">
            Contáctanos para comenzar a diseñar tu estanque o bio-piscina hoy mismo.
          </p>
        </header>

        {/* Botones principales */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-teal-700 shadow-sm hover:bg-gray-100 transition"
          >
            <ArrowRight className="h-5 w-5" /> Ir a Contacto
          </Link>
          <a
            href="mailto:bluegarden357@gmail.com"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-teal-700 shadow-sm hover:bg-gray-100 transition"
          >
            <Mail className="h-5 w-5" /> Escríbenos
          </a>
        </div>

        {/* Ubicaciones */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.nombre}
              className="rounded-2xl bg-white/10 border border-white/15 p-6 shadow-md backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold">{loc.nombre}</h3>
                <div className="mt-4 space-y-2 text-white/90">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span>{loc.direccion}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-5 w-5 shrink-0" />
                    <a href={loc.telHref} className="hover:underline">
                      {loc.telefono}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-5 w-5 shrink-0" />
                    <a href={`mailto:${loc.email}`} className="hover:underline">
                      {loc.email}
                    </a>
                  </p>
                </div>
              </div>

              {/* Botones secundarios */}
              <div className="mt-6 flex flex-wrap gap-3">
                {loc.maps && (
                  <a
                    href={loc.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-teal-700 font-semibold hover:bg-gray-100 transition text-sm"
                  >
                    <MapPin className="h-4 w-4" /> Ver en Maps
                  </a>
                )}
                <a
                  href={loc.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-teal-300 bg-green-50 px-4 py-2 text-teal-900 font-semibold hover:bg-green-100 transition text-sm"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Nota de servicio nacional */}
        <p className="mt-10 text-center text-sm text-white/80">
          Atención nacional por WhatsApp:{" "}
          <a
            className="underline"
            href="https://wa.me/525547173446"
            target="_blank"
            rel="noopener noreferrer"
          >
            55 4717 3446
          </a>
        </p>
      </div>
    </section>
  );
}
