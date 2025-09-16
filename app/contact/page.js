// app/contact/page.js
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contacto | Blue Garden',
  description:
    'Contáctanos para plantas acuáticas, peces, biopiscinas, construcción, remodelación o mantenimiento. Sucursales en Centro, Cuernavaca y Riviera Maya.',
};

export default function ContactPage() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Video de fondo */}
      <video
        src="/Video_Listo_Biopiscina_Ecobrutalista.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Capa de contraste */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenido */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <header className="mb-8 text-white">
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            Contáctanos
          </h1>
          <p className="mt-2 max-w-3xl text-white/90">
            Cuéntanos qué necesitas: plantas, peces, un estanque/biopiscina o servicios de construcción, remodelación y mantenimiento.
          </p>
        </header>

        {/* Grid principal */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Datos de contacto */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-md">
              <h2 className="text-xl font-semibold">Datos de contacto</h2>
              <ul className="mt-4 space-y-3 text-white/90">
                <li>
                  <span className="block text-sm text-white/70">Teléfonos</span>
                  <div className="mt-1 space-y-1">
                    <a className="block hover:underline" href="tel:+527772568821">777 256 88 21</a>
                    <a className="block hover:underline" href="tel:+525547173446">55 4717 3446</a>
                    <a className="block hover:underline" href="tel:+527773779679">777 377 9679</a>
                  </div>
                </li>
                <li className="pt-2">
                  <span className="block text-sm text-white/70">Correo</span>
                  <a className="hover:underline" href="mailto:bluegarden357@gmail.com">
                    bluegarden357@gmail.com
                  </a>
                </li>
                <li className="pt-2">
                  <span className="block text-sm text-white/70">Facebook</span>
                  <Link
                    className="hover:underline"
                    href="https://www.facebook.com/Biojardinesbiopiscinas"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Biojardinesbiopiscinas
                  </Link>
                </li>
                <li className="pt-2">
                  <span className="block text-sm text-white/70">Instagram</span>
                  <Link
                    className="hover:underline"
                    href="https://www.instagram.com/bluegarden.mx/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    bluegarden.mx
                  </Link>
                </li>
              </ul>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/90">
                <p className="font-medium">Horario de atención</p>
                <p className="text-white/80">Lunes a sábado — 9:00 a 18:00 h</p>
              </div>
            </div>
          </aside>

          {/* Formulario / Cuestionario */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* Sucursales / Mapas */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-white">Nuestras sucursales</h2>
          <p className="mt-1 text-white/90">Visítanos en cualquiera de nuestras ubicaciones.</p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Sucursal 1 */}
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md">
              <h3 className="text-lg font-semibold">Planta acuática (Cuernavaca)</h3>
              <div className="mt-3 overflow-hidden rounded-xl">
                <div className="aspect-video">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.5587451004576!2d-99.26266314190131!3d18.941047649845586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cddf2a9f23695f%3A0x1bb29ff6d2c91240!2sPlanta%20acu%C3%A1tica!5e0!3m2!1ses!2smx!4v1755228412452!5m2!1ses!2smx"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full"
                  />
                </div>
              </div>
              <div className="mt-3">
                <Link
                  href="https://share.google/46wwBUOGblAgqbwlW"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline"
                >
                  Abrir en Google Maps
                </Link>
              </div>
            </div>

            {/* Sucursal 2 - ACTUALIZADA */}
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md">
              <h3 className="text-lg font-semibold">Blue Garden Centro</h3>
              <div className="mt-3 overflow-hidden rounded-xl">
                <div className="aspect-video">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d210.70762734397735!2d-99.23521866913863!3d18.917754030185566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cddf0024bdfdeb%3A0xd6f5408272cb1c34!2sBlue%20Garden%20Centro%20(Planta%20Acu%C3%A1tica)!5e1!3m2!1ses!2smx!4v1755584880591!5m2!1ses!2smx"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full"
                  />
                </div>
              </div>
              <div className="mt-3">
                <Link
                  href="https://maps.app.goo.gl/W1MEdCESj4jnRiry9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline"
                >
                  Abrir en Google Maps
                </Link>
              </div>
            </div>

            {/* Sucursal 3 */}
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-md">
              <h3 className="text-lg font-semibold">Blue Garden Riviera Maya</h3>
              <div className="mt-3 overflow-hidden rounded-xl">
                <div className="aspect-video">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119466.23079868975!2d-87.16264515019431!3d20.656567959088655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4e4323d22d4e61%3A0xe8c10b783bab4adc!2sPlaya%20del%20Carmen%2C%20Q.R.!5e0!3m2!1ses!2smx!4v1755230175858!5m2!1ses!2smx"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full"
                  />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-sm text-white/80">
                  Cobertura: Playa del Carmen y alrededores
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <footer className="mt-10 text-center text-white">
          <p className="text-white/90">
            También puedes escribirnos a{' '}
            <a className="underline" href="mailto:bluegarden357@gmail.com">bluegarden357@gmail.com</a>{' '}
            o enviarnos WhatsApp al{' '}
            <a className="underline" href="https://wa.me/525547173446" target="_blank" rel="noopener noreferrer">
              55 4717 3446
            </a>.
          </p>
        </footer>
      </div>
    </section>
  );
}
