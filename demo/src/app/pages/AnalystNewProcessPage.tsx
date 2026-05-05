import { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { apiFetch } from '../../lib/api';
import valdiviaLogo from '../../assets/9ea87c1c8d8e49e210fe4afd0e12a9f44fe0b8ee.png';

const MODALIDADES = [
  'Licitación Pública',
  'Selección Abreviada',
  'Concurso de Méritos',
  'Contratación Directa',
];

interface FormData {
  name: string;
  entity: string;
  modality: string;
  budget: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function AnalystNewProcessPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    name: '',
    entity: '',
    modality: '',
    budget: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const userStr = localStorage.getItem('valdivia_user');
  let analystId = '';
  try {
    const parsed = userStr ? JSON.parse(userStr) : null;
    analystId = parsed?.id ?? '';
  } catch { /* corrupted */ }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.entity || !form.modality || !form.budget || !form.startDate || !form.endDate) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      setError('La fecha de inicio debe ser anterior a la fecha de cierre.');
      return;
    }
    if (!analystId) {
      setError('No se encontró el ID del analista. Por favor inicie sesión nuevamente.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/tender-processes', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          entity: form.entity,
          modality: form.modality,
          budget: Number(form.budget),
          description: form.description,
          startDate: form.startDate,
          endDate: form.endDate,
          analystId,
          supervisorRole: false,
          accessLevel: 'write',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Error al crear el proceso.');
        return;
      }

      setSuccessId(data.process?.generatedId ?? 'N/A');
    } catch {
      setError('Error de conexión. Verifique que el servidor esté activo.');
    } finally {
      setSubmitting(false);
    }
  }

  if (successId) {
    return (
      <div className="min-h-screen bg-slate-50/50 font-sans flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-10 max-w-md w-full text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Proceso Creado</h2>
          <p className="text-sm text-slate-500 mb-4">El proceso fue registrado exitosamente en el sistema SECOP II.</p>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-6">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">ID Generado</p>
            <p className="text-2xl font-bold font-mono text-[#002B5B]">{successId}</p>
          </div>
          <Button
            onClick={() => navigate('/operative/processes')}
            className="w-full bg-[#002B5B] hover:bg-[#001F44] text-white"
          >
            Ver Mis Procesos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/operative/processes" className="text-slate-500 hover:text-[#002B5B] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <img src={valdiviaLogo} alt="Logo VALDIVIA" className="h-16 w-auto object-contain" />
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-[#002B5B] leading-none">Nuevo Proceso de Contratación</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">SECOP II · Registro de Proceso</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-blue-50 border-blue-100">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Borrador</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <FileText className="h-4 w-4" /> Datos del Proceso Contractual
            </h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nombre */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Nombre del Proceso <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Suministro de equipos de cómputo para la entidad"
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B]"
                />
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Entidad */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Entidad Contratante <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="entity"
                  value={form.entity}
                  onChange={handleChange}
                  placeholder="Ej. Municipio de Bogotá D.C."
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B]"
                />
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Modalidad */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Modalidad de Selección <span className="text-red-500">*</span>
              </label>
              <select
                name="modality"
                value={form.modality}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] bg-white appearance-none"
              >
                <option value="">Seleccione modalidad...</option>
                {MODALIDADES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Presupuesto */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Presupuesto Oficial (COP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full pl-10 pr-16 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B]"
                />
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">COP</span>
              </div>
              {form.budget && (
                <p className="text-xs text-slate-500 font-medium">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(form.budget))}
                </p>
              )}
            </div>

            {/* Fecha inicio */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Fecha de Inicio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B]"
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Fecha cierre */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Fecha de Cierre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate || undefined}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B]"
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="md:col-span-2 border-t border-slate-100 my-1" />

            {/* Descripción */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Objeto Contractual
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describa el objeto del contrato, especificaciones técnicas y alcance del proceso..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] resize-none"
              />
            </div>

          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 sticky bottom-0 z-10">
            <p className="text-xs text-slate-400 hidden sm:block">
              <span className="text-red-500">*</span> Campos obligatorios
            </p>
            <div className="flex gap-3 ml-auto">
              <Link to="/operative/processes">
                <Button type="button" variant="outline" className="text-slate-600 border-slate-300 bg-white">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#002B5B] hover:bg-[#001F44] text-white min-w-[160px]"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creando...</>
                ) : (
                  <><CheckCircle className="h-4 w-4 mr-2" /> Crear Proceso</>
                )}
              </Button>
            </div>
          </div>
        </form>

        <p className="text-center text-xs text-slate-400 pb-4">
          Plataforma VALDIVIA · Los procesos creados se registran en SECOP II automáticamente
        </p>
      </main>
    </div>
  );
}
