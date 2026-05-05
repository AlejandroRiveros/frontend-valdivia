import { useState, useEffect } from 'react';
import {
  LogOut,
  UserCheck,
  FileText,
  RefreshCw,
  AlertCircle,
  Calendar,
  Building2,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { apiFetch } from '../../lib/api';
import valdiviaLogo from '../../assets/9ea87c1c8d8e49e210fe4afd0e12a9f44fe0b8ee.png';

interface TenderProcess {
  id: string;
  generatedId: string | null;
  name: string;
  entity: string;
  modality: string;
  budget: number;
  status: string;
  startDate: string;
  endDate: string;
  analyst: { name: string };
}

const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-500 border-slate-200',
  ACTIVE: 'bg-blue-50 text-blue-700 border-blue-200',
  CLOSED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Borrador',
  ACTIVE: 'Activo',
  CLOSED: 'Cerrado',
};

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function daysLeft(endDate: string): number {
  return Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000);
}

export default function SupervisorDashboardPage() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState<TenderProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userStr = localStorage.getItem('valdivia_user');
  let userName = 'Supervisor';
  let userId = '';
  let userInitials = 'SV';
  try {
    const u = userStr ? JSON.parse(userStr) : null;
    if (u?.name) {
      userName = u.name;
      userInitials = u.name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    if (u?.id) userId = u.id;
  } catch {}

  async function fetchProcesses() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/tender-processes?supervisorId=${userId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProcesses(data);
    } catch {
      setError('No se pudieron cargar los procesos asignados.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) fetchProcesses();
    else setLoading(false);
  }, [userId]);

  function handleLogout() {
    localStorage.removeItem('valdivia_token');
    localStorage.removeItem('valdivia_user');
    navigate('/');
  }

  const active = processes.filter(p => p.status === 'ACTIVE').length;
  const draft = processes.filter(p => p.status === 'DRAFT').length;
  const closed = processes.filter(p => p.status === 'CLOSED').length;

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={valdiviaLogo} alt="Logo VALDIVIA" className="h-16 w-auto object-contain" />
            <div className="h-5 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:block">
              <h1 className="text-sm font-bold text-[#002B5B] leading-none">Panel de Supervisión</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                Contratos asignados
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border bg-indigo-50 border-indigo-100">
              <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Supervisor</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-[#002B5B] flex items-center justify-center text-white text-xs font-bold">
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
          <p className="text-sm text-slate-500 mt-0.5">
            Aquí tienes los procesos de contratación que tienes asignados para supervisar.
          </p>
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
            <Button variant="outline" size="sm" onClick={fetchProcesses} className="ml-auto text-xs">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reintentar
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Activos</span>
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{active}</p>
              <p className="text-xs text-slate-400 mt-1">procesos en ejecución</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">En borrador</span>
                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{draft}</p>
              <p className="text-xs text-slate-400 mt-1">pendientes de activar</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Cerrados</span>
                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{closed}</p>
              <p className="text-xs text-slate-400 mt-1">finalizados</p>
            </div>
          </div>
        )}

        {/* Tabla de procesos */}
        {!loading && !error && (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700">
                Mis procesos asignados
              </h3>
              <button
                onClick={fetchProcesses}
                className="text-xs text-slate-400 hover:text-[#002B5B] transition-colors p-1.5 hover:bg-slate-50 rounded-lg"
                aria-label="Actualizar"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            {processes.length === 0 ? (
              <div className="p-12 flex flex-col items-center gap-3 text-center">
                <UserCheck className="h-10 w-10 text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">
                  No tienes procesos asignados aún
                </p>
                <p className="text-xs text-slate-400">
                  El Director asignará procesos a tu cuenta cuando sea necesario.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100 font-semibold tracking-wider">
                    <tr>
                      <th className="px-5 py-3">ID SECOP</th>
                      <th className="px-5 py-3">Nombre del proceso</th>
                      <th className="px-5 py-3">Entidad</th>
                      <th className="px-5 py-3">Presupuesto</th>
                      <th className="px-5 py-3">Vigencia</th>
                      <th className="px-5 py-3">Días restantes</th>
                      <th className="px-5 py-3">Estado</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {processes.map(p => {
                      const remaining = daysLeft(p.endDate);
                      const isUrgent = remaining <= 30 && p.status === 'ACTIVE';
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-5 py-3 font-mono text-xs font-bold text-[#002B5B]">
                            {p.generatedId ?? '—'}
                          </td>
                          <td className="px-5 py-3">
                            <div className="font-medium text-slate-800 text-xs max-w-[200px]">
                              <span className="truncate block" title={p.name}>{p.name}</span>
                            </div>
                            {p.analyst?.name && (
                              <div className="text-[10px] text-slate-400 mt-0.5">Analista: {p.analyst.name}</div>
                            )}
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="h-3 w-3 text-slate-400 flex-shrink-0" />
                              <span className="truncate max-w-[120px]" title={p.entity}>{p.entity}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-xs font-semibold font-mono text-slate-700">
                            {formatCOP(p.budget)}
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-slate-400 flex-shrink-0" />
                              <span>{formatDate(p.startDate)}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              hasta {formatDate(p.endDate)}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className={`flex items-center gap-1 text-xs font-semibold ${isUrgent ? 'text-red-600' : 'text-slate-600'}`}>
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              {remaining > 0 ? `${remaining}d` : 'Vencido'}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${STATUS_BADGE[p.status] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                              {STATUS_LABEL[p.status] ?? p.status}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#002B5B] transition-colors" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-slate-400 pb-4">
          Plataforma VALDIVIA · {processes.length} proceso{processes.length !== 1 ? 's' : ''} asignado{processes.length !== 1 ? 's' : ''} · Módulo de Supervisión
        </p>
      </main>
    </div>
  );
}
