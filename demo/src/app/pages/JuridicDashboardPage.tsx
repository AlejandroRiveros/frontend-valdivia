import { useState, useEffect } from 'react';
import {
  FileCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  LogOut,
  Scale,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { apiFetch } from '../../lib/api';
import valdiviaLogo from '../../assets/9ea87c1c8d8e49e210fe4afd0e12a9f44fe0b8ee.png';

interface Deliverable {
  id: string;
  contractId: string;
  contractor: string;
  type: string;
  month: string;
  submissionDate: string;
  docStatus: string;
  balanceStatus: string;
  status: string;
  amount: number;
}

const DOC_BADGE: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-500 border-slate-200',
  valid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  expired: 'bg-red-50 text-red-700 border-red-200',
};

const DOC_LABEL: Record<string, string> = {
  pending: 'Pendiente',
  valid: 'Vigente',
  warning: 'Por vencer',
  expired: 'Vencido',
};

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

export default function JuridicDashboardPage() {
  const navigate = useNavigate();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userStr = localStorage.getItem('valdivia_user');
  let userName = 'Jurídico';
  let userInitials = 'JR';
  try {
    const u = userStr ? JSON.parse(userStr) : null;
    if (u?.name) {
      userName = u.name;
      userInitials = u.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
    }
  } catch {}

  async function fetchDeliverables() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/deliverables');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDeliverables(data);
    } catch {
      setError('No se pudieron cargar los entregables.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchDeliverables(); }, []);

  function handleLogout() {
    localStorage.removeItem('valdivia_token');
    localStorage.removeItem('valdivia_user');
    navigate('/');
  }

  const pendingDocs = deliverables.filter(d => d.docStatus === 'pending' && d.status === 'pending').length;
  const validDocs = deliverables.filter(d => d.docStatus === 'valid').length;
  const alertDocs = deliverables.filter(d => d.docStatus === 'warning' || d.docStatus === 'expired').length;

  const recentPending = deliverables
    .filter(d => d.docStatus === 'pending' && d.status === 'pending')
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={valdiviaLogo} alt="Logo VALDIVIA" className="h-16 w-auto object-contain" />
            <div className="h-5 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:block">
              <h1 className="text-sm font-bold text-[#002B5B] leading-none">Panel Jurídico</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Revisión Documental y Legal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-slate-800 text-xs leading-none">{userName}</p>
              <p className="text-slate-400 text-[10px] mt-1 leading-none">Panel Jurídico</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-[#002B5B] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
              {userInitials}
            </div>
            <button
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <div>
          <h2 className="text-lg font-bold text-slate-800">Bienvenido, {userName}</h2>
          <p className="text-sm text-slate-500 mt-0.5">Resumen del estado documental de entregables</p>
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 animate-pulse">
                <div className="h-3 bg-slate-100 rounded w-24 mb-4" />
                <div className="h-8 bg-slate-100 rounded w-12" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchDeliverables} className="ml-auto text-xs">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reintentar
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pendientes de revisión</span>
                <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{pendingDocs}</p>
              <p className="text-xs text-slate-400 mt-1">entregables sin dictamen</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Documentación vigente</span>
                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{validDocs}</p>
              <p className="text-xs text-slate-400 mt-1">con estado válido</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Alertas documentales</span>
                <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{alertDocs}</p>
              <p className="text-xs text-slate-400 mt-1">por vencer o vencidos</p>
            </div>
          </div>
        )}

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/juridic/doc-review')}
            className="bg-[#002B5B] hover:bg-[#001F44] text-white rounded-xl p-5 text-left transition-colors group"
          >
            <FileCheck className="h-6 w-6 mb-3 opacity-80" />
            <p className="font-bold text-sm">Revisar Documentación</p>
            <p className="text-xs opacity-70 mt-0.5">Emitir dictamen sobre entregables</p>
          </button>
          <button
            onClick={() => navigate('/juridic/processes')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-5 text-left transition-colors group"
          >
            <Scale className="h-6 w-6 mb-3 text-[#002B5B] opacity-80" />
            <p className="font-bold text-sm text-[#002B5B]">Ver Procesos de Licitación</p>
            <p className="text-xs text-slate-400 mt-0.5">Consultar contratos activos</p>
          </button>
        </div>

        {/* Tabla de pendientes */}
        {!loading && !error && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700">Entregables pendientes de revisión</h3>
              <button
                onClick={() => navigate('/juridic/doc-review')}
                className="text-xs font-semibold text-[#002B5B] hover:underline flex items-center gap-1"
              >
                Ver todos <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            {recentPending.length === 0 ? (
              <div className="p-10 text-center">
                <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No hay entregables pendientes de revisión</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100 font-semibold tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Contrato</th>
                      <th className="px-5 py-3">Contratista</th>
                      <th className="px-5 py-3">Tipo</th>
                      <th className="px-5 py-3">Mes</th>
                      <th className="px-5 py-3">Estado documental</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentPending.map(d => (
                      <tr
                        key={d.id}
                        onClick={() => navigate('/juridic/doc-review')}
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <td className="px-5 py-3 font-mono text-xs text-slate-600 font-semibold">{d.contractId}</td>
                        <td className="px-5 py-3 text-xs text-slate-700 max-w-[140px]">
                          <span className="truncate block" title={d.contractor}>{d.contractor}</span>
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-600">{d.type}</td>
                        <td className="px-5 py-3 text-xs text-slate-500">{d.month}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${DOC_BADGE[d.docStatus] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {DOC_LABEL[d.docStatus] ?? d.docStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#002B5B] transition-colors" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-slate-400 pb-4">
          Plataforma VALDIVIA · Módulo Jurídico
        </p>
      </main>
    </div>
  );
}
