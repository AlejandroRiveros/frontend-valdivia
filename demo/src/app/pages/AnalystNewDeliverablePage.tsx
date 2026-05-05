import { useState } from 'react';
import {
  ArrowLeft,
  FileCheck,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Hash,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { apiFetch } from '../../lib/api';
import valdiviaLogo from '../../assets/9ea87c1c8d8e49e210fe4afd0e12a9f44fe0b8ee.png';

const TIPOS = [
  'Informe mensual',
  'Cuenta de cobro',
  'Acta de entrega',
  'Certificado de cumplimiento',
];

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

interface FormData {
  contractId: string;
  contractorId: string;
  type: string;
  month: string;
  submissionDate: string;
  amount: string;
  observations: string;
}

export default function AnalystNewDeliverablePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    contractId: '',
    contractorId: '',
    type: '',
    month: '',
    submissionDate: new Date().toISOString().split('T')[0],
    amount: '',
    observations: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const currentYear = new Date().getFullYear();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.contractId || !form.contractorId || !form.type || !form.month || !form.submissionDate || !form.amount) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/deliverables', {
        method: 'POST',
        body: JSON.stringify({
          contractId: form.contractId,
          contractorId: form.contractorId,
          type: form.type,
          month: `${form.month} ${currentYear}`,
          submissionDate: form.submissionDate,
          amount: Number(form.amount),
          observations: form.observations || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Error al registrar el entregable.');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Error de conexión. Verifique que el servidor esté activo.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50/50 font-sans flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-10 max-w-md w-full text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Entregable Registrado</h2>
          <p className="text-sm text-slate-500 mb-4">
            El entregable fue radicado exitosamente y quedó en estado <strong>Pendiente</strong> de revisión por el Director.
          </p>
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold uppercase">Contrato</span>
              <span className="font-mono font-bold text-slate-700">{form.contractId}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold uppercase">Tipo</span>
              <span className="text-slate-700">{form.type}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold uppercase">Periodo</span>
              <span className="text-slate-700">{form.month} {currentYear}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => { setSuccess(false); setForm({ contractId: '', contractorId: '', type: '', month: '', submissionDate: new Date().toISOString().split('T')[0], amount: '', observations: '' }); }}
              className="flex-1 border-slate-200 text-slate-600"
            >
              Nuevo Entregable
            </Button>
            <Button
              onClick={() => navigate('/operative/deliverables')}
              className="flex-1 bg-[#002B5B] hover:bg-[#001F44] text-white"
            >
              Ver Entregables
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/operative/deliverables" className="text-slate-500 hover:text-[#002B5B] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <img src={valdiviaLogo} alt="Logo VALDIVIA" className="h-16 w-auto object-contain" />
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-[#002B5B] leading-none">Registrar Entregable de Pago</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Radicación para autorización del Director</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-amber-50 border-amber-100">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Pendiente</span>
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
              <FileCheck className="h-4 w-4" /> Datos del Entregable
            </h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ID Contrato */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                ID del Contrato <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="contractId"
                  value={form.contractId}
                  onChange={handleChange}
                  placeholder="Ej. CT-892, LP-2026-001"
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] font-mono"
                />
                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* ID Contratista */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                ID del Contratista <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="contractorId"
                  value={form.contractorId}
                  onChange={handleChange}
                  placeholder="UUID del contratista registrado"
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] font-mono"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-400">El ID del contratista debe estar registrado en el sistema.</p>
            </div>

            {/* Tipo de entregable */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Tipo de Entregable <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] bg-white appearance-none"
              >
                <option value="">Seleccione tipo...</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Mes de ejecución */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Mes de Ejecución <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] bg-white appearance-none"
                >
                  <option value="">Mes...</option>
                  {MESES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <div className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 text-slate-500 font-mono shrink-0">
                  {currentYear}
                </div>
              </div>
            </div>

            {/* Fecha radicación */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Fecha de Radicación <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="submissionDate"
                  value={form.submissionDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B]"
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Valor Solicitado (COP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full pl-10 pr-16 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B]"
                />
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">COP</span>
              </div>
              {form.amount && (
                <p className="text-xs text-slate-500 font-medium">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(form.amount))}
                </p>
              )}
            </div>

            <div className="md:col-span-2 border-t border-slate-100 my-1" />

            {/* Observaciones */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Observaciones
              </label>
              <textarea
                name="observations"
                value={form.observations}
                onChange={handleChange}
                rows={3}
                placeholder="Observaciones adicionales, detalles del entregable, soportes adjuntos..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] resize-none"
              />
            </div>

            {/* Aviso informativo */}
            <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
              <div className="h-5 w-5 rounded-full bg-[#002B5B] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-[10px] font-bold">i</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#002B5B] mb-1">Proceso de autorización</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  El entregable quedará en estado <strong>Pendiente</strong> hasta que el Director Operativo revise los soportes documentales y el balance financiero. El pago se aprueba solo si la documentación está vigente y el balance es consistente.
                </p>
              </div>
            </div>

          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 sticky bottom-0 z-10">
            <p className="text-xs text-slate-400 hidden sm:block">
              <span className="text-red-500">*</span> Campos obligatorios
            </p>
            <div className="flex gap-3 ml-auto">
              <Link to="/operative/deliverables">
                <Button type="button" variant="outline" className="text-slate-600 border-slate-300 bg-white">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#002B5B] hover:bg-[#001F44] text-white min-w-[180px]"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registrando...</>
                ) : (
                  <><CheckCircle className="h-4 w-4 mr-2" /> Registrar Entregable</>
                )}
              </Button>
            </div>
          </div>
        </form>

        <p className="text-center text-xs text-slate-400 pb-4">
          Plataforma VALDIVIA · El entregable será revisado por el Director Operativo
        </p>
      </main>
    </div>
  );
}
