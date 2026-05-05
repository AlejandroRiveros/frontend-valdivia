import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  FileCheck,
  Search,
  RefreshCw,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
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

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected';

const TAB_LABELS: Record<FilterTab, string> = {
  all: 'Todos',
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
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

const BALANCE_BADGE: Record<string, string> = {
  pending: 'bg-slate-100 text-slate-500 border-slate-200',
  consistent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inconsistent: 'bg-red-50 text-red-700 border-red-200',
};

const BALANCE_LABEL: Record<string, string> = {
  pending: 'Pendiente',
  consistent: 'Consistente',
  inconsistent: 'Inconsistente',
};

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
}

export default function AnalystDeliverablesPage() {
  const navigate = useNavigate();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  async function fetchDeliverables() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/deliverables');
      if (!res.ok) throw new Error('Error del servidor');
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
    const matchesTab = activeTab === 'all' || d.status === activeTab;
    const matchesSearch = search === '' ||
      d.contractId.toLowerCase().includes(search.toLowerCase()) ||
      d.contractor.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase());
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
              <h1 className="text-sm font-bold text-[#002B5B] leading-none">Mis Entregables</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                Registro y Seguimiento de Pagos
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/operative/deliverables/new')}
            className="bg-[#002B5B] hover:bg-[#001F44] text-white h-9 text-xs px-4"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Registrar Entregable
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Filtros */}
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
                  <div className="h-4 bg-slate-100 rounded w-24" />
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
                No hay entregables {activeTab !== 'all' ? `con estado "${TAB_LABELS[activeTab]}"` : 'registrados'}
              </p>
              <p className="text-xs text-slate-400">Registra un nuevo entregable para iniciar el proceso de pago</p>
              <Button
                onClick={() => navigate('/operative/deliverables/new')}
                className="mt-2 bg-[#002B5B] hover:bg-[#001F44] text-white text-xs h-8 px-4"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Registrar Entregable
              </Button>
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
                    <th className="px-5 py-3">Valor</th>
                    <th className="px-5 py-3">Soportes</th>
                    <th className="px-5 py-3">Balance</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-5 py-3 font-mono text-xs text-slate-600 font-semibold">{d.contractId}</td>
                      <td className="px-5 py-3 text-slate-700 text-xs max-w-[140px]">
                        <span className="truncate block" title={d.contractor}>{d.contractor}</span>
                      </td>
                      <td className="px-5 py-3 text-slate-600 text-xs">{d.type}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{d.month}</td>
                      <td className="px-5 py-3 text-slate-700 text-xs font-semibold font-mono">
                        {formatCOP(d.amount)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${DOC_BADGE[d.docStatus] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {DOC_LABEL[d.docStatus] ?? d.docStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${BALANCE_BADGE[d.balanceStatus] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {BALANCE_LABEL[d.balanceStatus] ?? d.balanceStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${STATUS_BADGE[d.status] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {STATUS_LABEL[d.status] ?? d.status}
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
          Plataforma VALDIVIA · {filtered.length} entregable{filtered.length !== 1 ? 's' : ''}
        </p>
      </main>
    </div>
  );
}
