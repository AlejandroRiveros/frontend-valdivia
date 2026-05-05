import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  FileText,
  Search,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Calendar,
  Building2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
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

type FilterTab = 'all' | 'DRAFT' | 'ACTIVE' | 'CLOSED';

const TAB_LABELS: Record<FilterTab, string> = {
  all: 'Todos',
  DRAFT: 'Borrador',
  ACTIVE: 'Activo',
  CLOSED: 'Cerrado',
};

const STATUS_BADGE: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
  ACTIVE: 'bg-blue-50 text-blue-700 border-blue-200',
  CLOSED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Borrador',
  ACTIVE: 'Activo',
  CLOSED: 'Cerrado',
};

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AnalystProcessesPage() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState<TenderProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  const userStr = localStorage.getItem('valdivia_user');
  let user: { name?: string } | null = null;
  try { user = userStr ? JSON.parse(userStr) : null; } catch { /* corrupted */ }

  async function fetchProcesses() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/tender-processes');
      if (!res.ok) throw new Error('Error del servidor');
      const data = await res.json();
      setProcesses(data);
    } catch {
      setError('No se pudieron cargar los procesos. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProcesses(); }, []);

  const filtered = processes.filter(p => {
    const matchesTab = activeTab === 'all' || p.status === activeTab;
    const matchesSearch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.generatedId ?? '').toLowerCase().includes(search.toLowerCase()) ||
      p.entity.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/operative/dashboard" className="text-slate-500 hover:text-[#002B5B] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <img src={valdiviaLogo} alt="Logo VALDIVIA" className="h-16 w-auto object-contain" />
            <div className="h-5 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:block">
              <h1 className="text-sm font-bold text-[#002B5B] leading-none">Mis Procesos de Licitación</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                {user?.name ?? 'Analista'} · SECOP II
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/operative/processes/new')}
            className="bg-[#002B5B] hover:bg-[#001F44] text-white h-9 text-xs px-4"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Nuevo Proceso
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {(Object.keys(TAB_LABELS) as FilterTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-[#002B5B] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar proceso, entidad..."
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
                  <div className="h-4 bg-slate-100 rounded w-24" />
                  <div className="h-4 bg-slate-100 rounded flex-1" />
                  <div className="h-4 bg-slate-100 rounded w-32" />
                  <div className="h-4 bg-slate-100 rounded w-24" />
                  <div className="h-4 bg-slate-100 rounded w-20" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-12 flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <p className="text-sm font-semibold text-slate-700">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchProcesses} className="mt-1 text-xs">
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reintentar
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 flex flex-col items-center gap-3 text-center">
              <FileText className="h-10 w-10 text-slate-300" />
              <p className="text-sm font-semibold text-slate-500">No hay procesos {activeTab !== 'all' ? `con estado "${TAB_LABELS[activeTab]}"` : ''}</p>
              <p className="text-xs text-slate-400">Crea tu primer proceso de contratación</p>
              <Button
                onClick={() => navigate('/operative/processes/new')}
                className="mt-2 bg-[#002B5B] hover:bg-[#001F44] text-white text-xs h-8 px-4"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Nuevo Proceso
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100 font-semibold tracking-wider">
                  <tr>
                    <th className="px-5 py-3">ID SECOP</th>
                    <th className="px-5 py-3">Nombre del Proceso</th>
                    <th className="px-5 py-3">Entidad</th>
                    <th className="px-5 py-3">Modalidad</th>
                    <th className="px-5 py-3">Presupuesto</th>
                    <th className="px-5 py-3">Vigencia</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-5 py-3 font-mono text-xs text-slate-500">
                        {p.generatedId ?? '—'}
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-800 max-w-[220px]">
                        <span className="truncate block" title={p.name}>{p.name}</span>
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[140px]" title={p.entity}>{p.entity}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{p.modality}</td>
                      <td className="px-5 py-3 text-slate-700 text-xs font-semibold font-mono">
                        {formatCOP(p.budget)}
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>{formatDate(p.startDate)} – {formatDate(p.endDate)}</span>
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 pb-4">
          Plataforma VALDIVIA · Gestión Contractual SECOP II · {filtered.length} proceso{filtered.length !== 1 ? 's' : ''}
        </p>
      </main>
    </div>
  );
}
