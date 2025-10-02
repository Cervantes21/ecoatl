// components/ContactForm.jsx
'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [interest, setInterest] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  return (
    <form
      action="/api/contact"
      method="POST"
      className="rounded-2xl border border-slate-200 bg-white/95 p-8 shadow-lg backdrop-blur-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setError('');
        setSent(false);
        setSubmitting(true);
        try {
          const form = e.currentTarget;
          const formData = new FormData(form);
          const res = await fetch(form.action, {
            method: 'POST',
            body: formData,
          });
          if (!res.ok) throw new Error('Error al enviar el formulario');
          setSent(true);
          form.reset();
          setInterest('');
          setServiceType('');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Ocurrió un error');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <h2 className="text-2xl font-bold text-slate-800">Cuestionario rápido</h2>
      <p className="mt-2 text-sm text-slate-600">
        Cuéntanos en qué podemos ayudarte. Responde estas preguntas para atender mejor tu solicitud.
      </p>

      {/* Honeypot antispam */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nombre</label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-green-300 px-4 py-2 text-slate-700 shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-lg border border-green-300 px-4 py-2 text-slate-700 shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Teléfono (opcional)</label>
          <input
            type="tel"
            name="phone"
            className="mt-1 w-full rounded-lg border border-green-300 px-4 py-2 text-slate-700 shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300"
            placeholder="Ej. 777-111-2222"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">¿Qué te interesa?</label>
          <select
            name="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-green-300 px-4 py-2 text-slate-700 shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300"
          >
            <option value="" disabled>Selecciona una opción</option>
            <option value="plantas">Plantas acuáticas</option>
            <option value="peces">Peces</option>
            <option value="biopiscina">Estanque / Biopiscina</option>
          </select>
        </div>

        {/* Sub-preguntas según interés */}
        {interest === 'plantas' && (
          <div className="md:col-span-2 transition-all">
            <label className="block text-sm font-medium text-slate-700">¿Para qué espacio?</label>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="plants_for[]" value="estanque" /> Estanque
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="plants_for[]" value="acuario" /> Acuario
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="plants_for[]" value="jardin_agua" /> Jardín acuático
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="plants_for[]" value="otro" /> Otro
              </label>
            </div>
          </div>
        )}

        {interest === 'peces' && (
          <div className="md:col-span-2 transition-all">
            <label className="block text-sm font-medium text-slate-700">¿Qué tipo de peces buscas?</label>
            <input
              type="text"
              name="fish_types"
              className="mt-1 w-full rounded-lg border border-green-300 px-4 py-2 text-slate-700 shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300"
              placeholder="Ej. goldfish, koi, limpiafondos, etc."
            />
          </div>
        )}

        {interest === 'biopiscina' && (
          <div className="md:col-span-2 transition-all">
            <label className="block text-sm font-medium text-slate-700">Dimensiones aproximadas (opcional)</label>
            <input
              type="text"
              name="pond_size"
              className="mt-1 w-full rounded-lg border border-green-300 px-4 py-2 text-slate-700 shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300"
              placeholder="Largo x Ancho x Profundidad (m)"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700">¿Qué necesitas?</label>
          <select
            name="service_type"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-green-300 px-4 py-2 text-slate-700 shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300"
          >
            <option value="" disabled>Selecciona un servicio</option>
            <option value="construccion">Construcción</option>
            <option value="remodelacion">Remodelación</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="asesoria">Asesoría / Cotización</option>
          </select>
        </div>

        {serviceType === 'mantenimiento' && (
          <div className="transition-all">
            <label className="block text-sm font-medium text-slate-700">Frecuencia deseada</label>
            <select
              name="maintenance_frequency"
              className="mt-1 w-full rounded-lg border border-green-300 px-4 py-2 text-slate-700 shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300"
            >
              <option value="">Selecciona una opción</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
              <option value="eventual">Eventual</option>
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Mensaje / Detalles</label>
          <textarea
            name="message"
            rows={4}
            className="mt-1 w-full rounded-lg border border-green-300 px-4 py-2 text-slate-700 shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300"
            placeholder="Describe tu proyecto o requerimiento…"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-start gap-3 text-sm text-slate-700">
            <input type="checkbox" name="consent" required /> 
            <span>Acepto ser contactado por Atl Ecosystem para responder a mi solicitud.</span>
          </label>
        </div>
      </div>

      {/* Estados y acciones */}
      {error && (
        <p className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {sent && (
        <p className="mt-4 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700">
          ✅ ¡Gracias! Recibimos tu mensaje y te contactaremos pronto.
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-700 px-6 py-2.5 font-semibold text-white shadow-md hover:from-sky-600 hover:to-sky-800 disabled:opacity-60"
        >
          {submitting ? 'Enviando…' : 'Enviar solicitud'}
        </button>
        <a
          href="https://wa.me/527772568821"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-green-500 bg-green-50 px-6 py-2.5 font-semibold text-green-700 shadow-sm hover:bg-green-100"
        >
          Enviar por WhatsApp
        </a>
      </div>
    </form>
  );
}
