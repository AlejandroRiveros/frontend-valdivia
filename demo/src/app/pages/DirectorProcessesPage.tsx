import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  Search,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Calendar,
  Building2,
  UserCheck,
  UserPlus,
  X,
  Check,
} from 'lucide-react';
import { Link } from 'react-router';
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
  supervisor: { id: string; name: string } | null;
}

interface SupervisorUser {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
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

export default function DirectorProcessesPage() {
  const [processes, setProcesses] = useState<TenderProcess[]>([]);
  const [supervisors, setSupervisors] = useState<SupervisorUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Panel state
  const [selected, setSelected] = useState<TenderProcess | null>(null);
  const [chosenSupervisorId, setChosenSupervisorId] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [procRes, supRes] = await Promise.all([
        apiFetch('/tender-processes'),
        apiFetch('/users?role=SUPERVISOR'),
      ]);
      if (!procRes.ok || !supRes.ok) throw new Error();
      const [procData, supData] = await Promise.all([procRes.json(), supRes.json()]);
      setProcesses(procData);
      setSupervisors(supData);
    } catch {
      setError('No se pudieron cargar los datos. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  function openPanel(p: TenderProcess) {
    setSelected(p);
    setChosenSupervisorId(p.supervisor?.id ?? '');
    setSaveError(null);
    setSaveSuccess(false);
  }

  function closePanel() {
    setSelected(null);
    setSaveError(null);
    setSaveSuccess(false);
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const res = await apiFetch(`/tender-processes/${selected.id}/assign-supervisor`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supervisorId: chosenSupervisorId || null }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? 'Error al guardar');
      }
      const sup = supervisors.find(s => s.id === chosenSupervisorId) ?? null;
      setProcesses(prev =>
        prev.map(p =>
          p.id === selected.id
            ? { ...p, supervisor: sup ? { id: sup.id, name: sup.name } : null }
            : p
        )
      );
      setSelected(prev => prev ? { ...prev, supervisor: sup ? { id: sup.id, name: sup.name } : null } : prev);
      setSaveSuccess(true);
    } catch (e: any) {
      setSaveError(e.message ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  const filtered = processes.filter(p => {
    const q = search.toLowerCase();
    return (
      search === '' ||
      (p.generatedId ?? '').toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.entity.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/director/dashboard"
              className="text-slate-500 hover:text-[#002B5B] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <img src={valdiviaLogo} alt="Logo VALDIVIA" className="h-16 w-auto object-contain" />
            <div className="h-5 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:block">
              <h1 className="text-sm font-bold text-[#002B5B] leading-none">Procesos de Contratación</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                Asignación de supervisores
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-indigo-50 border-indigo-100">
            <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Director</span>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Main content */}
        <main className={`flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-6 transition-all ${selected ? 'lg:pr-4' : ''}`}>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-700">Todos los procesos</h2>
              <p className="text-xs text-slate-400 mt-0.5">Haz clic en un proceso para asignar o cambiar su supervisor</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ID SECOP, nombre, entidad..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B]"
                />
              </div>
              <button
                onClick={fetchAll}
                className="p-2 text-slate-400 hover:text-[#002B5B] border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors"
                aria-label="Actualizar"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="h-4 bg-slate-100 rounded w-24" />
                    <div className="h-4 bg-slate-100 rounded w-48" />
                    <div className="h-4 bg-slate-100 rounded flex-1" />
                    <div className="h-4 bg-slate-100 rounded w-20" />
                    <div className="h-4 bg-slate-100 rounded w-28" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-12 flex flex-col items-center gap-3 text-center">
                <AlertCircle className="h-10 w-10 text-red-400" />
                <p className="text-sm font-semibold text-slate-700">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchAll} className="mt-1 text-xs">
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reintentar
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 flex flex-col items-center gap-3 text-center">
                <FileText className="h-10 w-10 text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">No hay procesos registrados</p>
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
                      <th className="px-5 py-3">Supervisor asignado</th>
                      <th className="px-5 py-3">Estado</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map(p => (
                      <tr
                        key={p.id}
                        onClick={() => openPanel(p)}
                        className={`hover:bg-slate-50 transition-colors group cursor-pointer ${selected?.id === p.id ? 'bg-indigo-50/50' : ''}`}
                      >
                        <td className="px-5 py-3 font-mono text-xs font-bold text-[#002B5B]">
                          {p.generatedId ?? '—'}
                        </td>
                        <td className="px-5 py-3">
                          <div className="font-medium text-slate-800 text-xs max-w-[180px]">
                            <span className="truncate block" title={p.name}>{p.name}</span>
                          </div>
                          {p.analyst?.name && (
                            <div className="text-[10px] text-slate-400 mt-0.5">Analista: {p.analyst.name}</div>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3 w-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate max-w-[100px]" title={p.entity}>{p.entity}</span>
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
                          {p.supervisor ? (
                            <div className="flex items-center gap-1.5">
                              <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <UserCheck className="h-2.5 w-2.5 text-indigo-600" />
                              </div>
                              <span className="text-xs font-medium text-indigo-700 truncate max-w-[100px]" title={p.supervisor.name}>
                                {p.supervisor.name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <UserPlus className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="text-xs">Sin asignar</span>
                            </div>
                          )}
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 pb-4">
            Plataforma VALDIVIA · {filtered.length} proceso{filtered.length !== 1 ? 's' : ''} · {supervisors.length} supervisor{supervisors.length !== 1 ? 'es' : ''} disponible{supervisors.length !== 1 ? 's' : ''}
          </p>
        </main>

        {/* Side panel */}
        {selected && (
          <aside className="w-full lg:w-96 border-l border-slate-200 bg-white flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700">Asignar supervisor</h3>
              <button
                onClick={closePanel}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Process info */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#002B5B]">
                    {selected.generatedId ?? '—'}
                  </span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${STATUS_BADGE[selected.status] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {STATUS_LABEL[selected.status] ?? selected.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800">{selected.name}</p>
                <p className="text-[10px] text-slate-500">{selected.entity}</p>
                <p className="text-[10px] text-slate-500 font-mono font-semibold">{formatCOP(selected.budget)}</p>
              </div>

              {/* Current supervisor */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Supervisor actual</p>
                {selected.supervisor ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-indigo-200 flex items-center justify-center flex-shrink-0">
                      <UserCheck className="h-3 w-3 text-indigo-700" />
                    </div>
                    <span className="text-xs font-semibold text-indigo-800">{selected.supervisor.name}</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Sin supervisor asignado</p>
                )}
              </div>

              {/* Supervisor selector */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  {supervisors.length === 0 ? 'Supervisores disponibles' : `Seleccionar supervisor (${supervisors.length})`}
                </p>

                {supervisors.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
                    No hay usuarios con rol SUPERVISOR registrados en el sistema. Cree uno desde el panel de administración.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => setChosenSupervisorId('')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left text-xs transition-all ${
                        chosenSupervisorId === ''
                          ? 'border-slate-400 bg-slate-50 font-semibold text-slate-700'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <X className="h-3 w-3 text-slate-500" />
                      </div>
                      Sin supervisor (quitar asignación)
                      {chosenSupervisorId === '' && <Check className="h-3.5 w-3.5 ml-auto text-slate-600" />}
                    </button>

                    {supervisors.filter(s => s.isActive).map(sup => (
                      <button
                        key={sup.id}
                        onClick={() => setChosenSupervisorId(sup.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left text-xs transition-all ${
                          chosenSupervisorId === sup.id
                            ? 'border-indigo-400 bg-indigo-50 font-semibold text-indigo-800'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-indigo-700">
                          {sup.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate">{sup.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{sup.email}</p>
                        </div>
                        {chosenSupervisorId === sup.id && (
                          <Check className="h-3.5 w-3.5 ml-auto text-indigo-600 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Feedback */}
              {saveError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" />
                  Asignación guardada correctamente.
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button
                  onClick={handleSave}
                  disabled={saving || supervisors.length === 0}
                  className="flex-1 bg-[#002B5B] hover:bg-[#001F44] text-white text-xs h-9"
                >
                  {saving ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando...
                    </span>
                  ) : (
                    'Guardar asignación'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={closePanel}
                  className="text-xs h-9"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
