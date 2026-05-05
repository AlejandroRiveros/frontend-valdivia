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
}

type StatusTab = 'all' | 'DRAFT' | 'ACTIVE' | 'CLOSED';

const TAB_LABELS: Record<StatusTab, string> = {
  all: 'Todos',
  DRAFT: 'Borrador',
  ACTIVE: 'Activo',
  CLOSED: 'Cerrado',
};

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

const MODALITY_SHORT: Record<string, string> = {
  'Licitación Pública': 'Lic. Pública',
  'Selección Abreviada': 'Sel. Abreviada',
  'Concurso de Méritos': 'Conc. Méritos',
  'Contratación Directa': 'Cont. Directa',
};

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function JuridicProcessesPage() {
  const [processes, setProcesses] = useState<TenderProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
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

  async function fetchProcesses() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/tender-processes');
      if (!res.ok) throw new Error();
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
    const q = search.toLowerCase();
    const matchesSearch = search === '' ||
      (p.generatedId ?? '').toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.entity.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/juridic/dashboard" className="text-slate-500 hover:text-[#002B5B] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <img src={valdiviaLogo} alt="Logo VALDIVIA" className="h-16 w-auto object-contain" />
            <div className="h-5 w-px bg-slate-200 hidden md:block" />
            <div className="hidden md:block">
              <h1 className="text-sm font-bold text-[#002B5B] leading-none">Procesos de Contratación</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Consulta jurídica — solo lectura</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {(Object.keys(TAB_LABELS) as StatusTab[]).map(tab => (
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
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="ID SECOP, nombre, entidad..."
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
                  <div className="h-4 bg-slate-100 rounded w-48" />
                  <div className="h-4 bg-slate-100 rounded flex-1" />
                  <div className="h-4 bg-slate-100 rounded w-20" />
                  <div className="h-4 bg-slate-100 rounded w-16" />
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
              <p className="text-sm font-semibold text-slate-500">
                No hay procesos {activeTab !== 'all' ? `con estado "${TAB_LABELS[activeTab]}"` : 'registrados'}
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
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {MODALITY_SHORT[p.modality] ?? p.modality}
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
          Plataforma VALDIVIA · {filtered.length} proceso{filtered.length !== 1 ? 's' : ''} · Vista de consulta jurídica
        </p>
      </main>
    </div>
  );
}
