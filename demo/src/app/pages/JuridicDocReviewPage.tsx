import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
  DollarSign,
  Calendar,
  User,
  Hash,
} from 'lucide-react';
import { Link } from 'react-router';
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

type DocTab = 'pending' | 'valid' | 'warning' | 'expired' | 'all';

const TAB_LABELS: Record<DocTab, string> = {
  pending: 'Pendientes',
  valid: 'Vigentes',
  warning: 'Por vencer',
  expired: 'Vencidos',
  all: 'Todos',
};

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

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

type NewDocStatus = 'valid' | 'warning' | 'expired';

const DOC_OPTION: { value: NewDocStatus; label: string; icon: React.ReactNode; cls: string }[] = [
  {
    value: 'valid',
    label: 'Vigente',
    icon: <CheckCircle className="h-4 w-4" />,
    cls: 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  },
  {
    value: 'warning',
    label: 'Por vencer',
    icon: <AlertTriangle className="h-4 w-4" />,
    cls: 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100',
  },
  {
    value: 'expired',
    label: 'Vencido',
    icon: <XCircle className="h-4 w-4" />,
    cls: 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100',
  },
];

export default function JuridicDocReviewPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DocTab>('pending');
  const [search, setSearch] = useState('');

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

  const [selected, setSelected] = useState<Deliverable | null>(null);
  const [newDocStatus, setNewDocStatus] = useState<NewDocStatus | null>(null);
  const [observation, setObservation] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function fetchDeliverables() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/deliverables');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDeliverables(data);
    } catch {
      setError('No se pudieron cargar los entregables. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchDeliverables(); }, []);

  const filtered = deliverables.filter(d => {
    const matchesTab = activeTab === 'all' || d.docStatus === activeTab;
    const matchesSearch = search === '' ||
      d.contractId.toLowerCase().includes(search.toLowerCase()) ||
      d.contractor.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  function openPanel(d: Deliverable) {
    setSelected(d);
    setNewDocStatus(null);
    setObservation('');
    setSaveError(null);
    setSaveSuccess(false);
  }

  function closePanel() {
    setSelected(null);
    setNewDocStatus(null);
    setObservation('');
    setSaveError(null);
    setSaveSuccess(false);
  }

  async function handleSave() {
    if (!selected || !newDocStatus) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await apiFetch(`/deliverables/${selected.id}/doc-status`, {
        method: 'PATCH',
        body: JSON.stringify({ docStatus: newDocStatus, observation: observation || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error ?? 'Error al guardar el dictamen.');
        return;
      }
      // Update local state
      setDeliverables(prev =>
        prev.map(d => d.id === selected.id ? { ...d, docStatus: newDocStatus } : d)
      );
      setSaveSuccess(true);
    } catch {
      setSaveError('Error de conexión.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800 flex flex-col">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/juridic/dashboard" className="text-slate-500 hover:text-[#002B5B] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <img src={valdiviaLogo} alt="Logo VALDIVIA" className="h-16 w-auto object-contain" />
            <div className="h-5 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:block">
              <h1 className="text-sm font-bold text-[#002B5B] leading-none">Revisión de Documentación</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Dictamen jurídico de entregables</p>
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
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">

        {/* LEFT: table */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
              {(Object.keys(TAB_LABELS) as DocTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === tab ? 'bg-[#002B5B] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Contrato, contratista, tipo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B]"
              />
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="h-4 bg-slate-100 rounded w-20" />
                    <div className="h-4 bg-slate-100 rounded w-32" />
                    <div className="h-4 bg-slate-100 rounded flex-1" />
                    <div className="h-4 bg-slate-100 rounded w-20" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-12 flex flex-col items-center gap-3 text-center">
                <AlertCircle className="h-10 w-10 text-red-400" />
                <p className="text-sm font-semibold text-slate-700">{error}</p>
                <Button variant="outline" size="sm" onClick={fetchDeliverables} className="mt-1 text-xs">
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reintentar
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 flex flex-col items-center gap-3 text-center">
                <FileCheck className="h-10 w-10 text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">
                  No hay entregables {activeTab !== 'all' ? `con estado "${TAB_LABELS[activeTab]}"` : ''}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100 font-semibold tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Contrato</th>
                      <th className="px-4 py-3">Contratista</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Mes</th>
                      <th className="px-4 py-3">Radicación</th>
                      <th className="px-4 py-3">Doc Status</th>
                      <th className="px-4 py-3">Pago</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map(d => (
                      <tr
                        key={d.id}
                        onClick={() => openPanel(d)}
                        className={`hover:bg-slate-50 transition-colors cursor-pointer group ${selected?.id === d.id ? 'bg-[#002B5B]/5' : ''}`}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-slate-600 font-semibold">{d.contractId}</td>
                        <td className="px-4 py-3 text-xs text-slate-700 max-w-[120px]">
                          <span className="truncate block" title={d.contractor}>{d.contractor}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 max-w-[120px]">
                          <span className="truncate block">{d.type}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{d.month}</td>
                        <td className="px-4 py-3 text-xs text-slate-500 font-mono">{d.submissionDate}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${DOC_BADGE[d.docStatus] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {DOC_LABEL[d.docStatus] ?? d.docStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${STATUS_BADGE[d.status] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {STATUS_LABEL[d.status] ?? d.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-slate-200 text-slate-600 hover:bg-[#002B5B] hover:text-white hover:border-[#002B5B] transition-all"
                            onClick={e => { e.stopPropagation(); openPanel(d); }}
                          >
                            Revisar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 pb-2">
            {filtered.length} entregable{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* RIGHT: panel */}
        {selected && (
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-[#002B5B]" /> Dictamen Jurídico
                </h2>
                <button
                  onClick={closePanel}
                  className="text-slate-400 hover:text-slate-600 text-lg leading-none font-bold"
                  aria-label="Cerrar panel"
                >
                  ×
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Info del entregable */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Hash className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-mono font-semibold">{selected.contractId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{selected.contractor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <FileCheck className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span>{selected.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span>{selected.month} · Radicado {selected.submissionDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold font-mono">{formatCOP(selected.amount)}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {saveSuccess ? (
                  <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Dictamen guardado</p>
                    <p className="text-xs text-slate-500">
                      Estado documental actualizado a <strong>{DOC_LABEL[newDocStatus!]}</strong>
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={closePanel}
                      className="mt-1 text-xs border-slate-200"
                    >
                      Cerrar
                    </Button>
                  </div>
                ) : selected.status !== 'pending' ? (
                  <div className="bg-slate-50 rounded-lg border border-slate-100 p-4 text-center">
                    <p className="text-xs text-slate-500">
                      Este entregable ya fue <strong>{STATUS_LABEL[selected.status]}</strong> por el Director.
                      No se puede modificar el estado documental.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Selector de estado */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Estado documental</p>
                      <div className="space-y-2">
                        {DOC_OPTION.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => setNewDocStatus(opt.value)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                              newDocStatus === opt.value
                                ? `${opt.cls} ring-2 ring-offset-1 ring-current`
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {opt.icon}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Observación */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Observación jurídica
                      </label>
                      <textarea
                        value={observation}
                        onChange={e => setObservation(e.target.value)}
                        rows={3}
                        placeholder="Detalles del dictamen, pólizas revisadas, observaciones legales..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] resize-none"
                      />
                    </div>

                    {saveError && (
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700">{saveError}</p>
                      </div>
                    )}

                    <Button
                      onClick={handleSave}
                      disabled={!newDocStatus || saving}
                      className="w-full bg-[#002B5B] hover:bg-[#001F44] text-white text-xs"
                    >
                      {saving ? (
                        <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Guardando...</>
                      ) : (
                        <><Scale className="h-3.5 w-3.5 mr-1.5" /> Guardar dictamen</>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
