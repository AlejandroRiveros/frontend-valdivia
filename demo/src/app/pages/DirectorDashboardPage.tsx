import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileCheck,
  FileText,
  FolderOpen,
  PlusCircle,
  Search,
  Settings,
  ShieldAlert,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Link, useNavigate } from 'react-router';
import DirectorHeader from '../components/director/DirectorHeader';

const kpiData = [
  { title: 'Contratos del periodo', value: '0', unit: 'Contratos', trend: '-', status: 'success', icon: TrendingUp },
  { title: 'Documentos aprobados', value: '0', unit: 'Docs', trend: '-', status: 'success', icon: CheckCircle2 },
  { title: 'Documentos rechazados', value: '0', unit: 'Docs', trend: '-', status: 'warning', icon: XCircle },
  { title: 'Cumplimiento global', value: '0%', unit: 'Eficiencia', trend: '-', status: 'success', icon: ScaleIcon },
  { title: 'Pagos autorizados', value: '$0', unit: 'COP', trend: '-', status: 'success', icon: MoneyIcon },
  { title: 'Cumplimiento doc.', value: '0%', unit: 'Global', trend: '-', status: 'warning', icon: FileCheck },
];

const quickActions = [
  {
    title: 'Revisar autorizaciones',
    description: 'Ir al flujo de pendientes, aprobaciones y devoluciones.',
    to: '/director/authorization?status=pending',
    icon: ClipboardCheck,
    accent: 'bg-blue-50 text-[#002B5B]',
  },
  {
    title: 'Abrir expediente contractual',
    description: 'Consultar hitos, modificaciones y trazabilidad del contrato.',
    to: '/director/contract-file?contractId=CT-2023-089',
    icon: FolderOpen,
    accent: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Iniciar nuevo proceso',
    description: 'Crear un proceso y asignar analista desde el panel directivo.',
    to: '/director/new-process',
    icon: PlusCircle,
    accent: 'bg-amber-50 text-amber-700',
  },
];

const riskData: any[] = [];
const monthlyTrendData: any[] = [];
const complianceData: any[] = [
  { name: 'Sin datos', value: 100, color: '#E2E8F0' }
];
const contractData: any[] = [];

function ScaleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

function MoneyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export default function DirectorDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <DirectorHeader heightClassName="h-16" />

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#002B5B]">Resumen Ejecutivo</h1>
              <p className="mt-1 text-sm text-slate-500">El dashboard ya funciona como entrada al modulo del director: revisar, autorizar, auditar contratos y crear procesos.</p>
            </div>
            <div className="flex gap-2">
              <Link to="/director/authorization?status=pending" className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                <ClipboardCheck className="h-4 w-4" />
                Ver pendientes
              </Link>
              <Link to="/director/new-process" className="flex items-center gap-2 rounded-md bg-[#002B5B] px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-[#001F44]">
                <PlusCircle className="h-4 w-4" />
                Nuevo proceso
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.to} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 transition-colors group-hover:text-[#002B5B]">{action.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{action.description}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${action.accent}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#002B5B]">
                  Ir al modulo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kpiData.map((kpi) => (
              <div key={kpi.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <kpi.icon className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ${kpi.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {kpi.trend}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-medium text-slate-500">{kpi.title}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-900">{kpi.value}</span>
                  <span className="text-xs font-medium text-slate-400">{kpi.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Tendencia documental</h3>
                    <p className="text-sm text-slate-500">Contratos vs. documentos gestionados</p>
                  </div>
                  <Link to="/director/authorization?status=all" className="text-sm font-medium text-[#002B5B] hover:underline">
                    Ver detalle
                  </Link>
                </div>
                <div className="h-[250px] w-full">
                  {monthlyTrendData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      Sin datos disponibles aún
                    </div>
                  ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="contractsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#002B5B" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#002B5B" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="docsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="contratos" stroke="#002B5B" strokeWidth={2} fillOpacity={1} fill="url(#contractsGradient)" name="Contratos" />
                      <Area type="monotone" dataKey="documentos" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#docsGradient)" name="Documentos" />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-2 w-full text-left text-base font-bold text-slate-900">Cumplimiento documental</h3>
                  <div className="relative h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie data={complianceData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {complianceData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    {complianceData.every(d => d.name === 'Sin datos') ? (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="pb-8 text-sm text-slate-400">Sin datos</span>
                      </div>
                    ) : (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="pb-8 text-2xl font-bold text-slate-800">92%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-base font-bold text-slate-900">Documentos pendientes</h3>
                  <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyTrendData.slice(-4)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="contratos" fill="#EF4444" radius={[4, 4, 0, 0]} name="Pendientes" barSize={30}>
                          {monthlyTrendData.slice(-4).map((entry, index) => (
                            <Cell key={`${entry.name}-${index}`} fillOpacity={0.35 + index * 0.15} fill="#EF4444" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
                <h3 className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldAlert className="h-4 w-4 text-slate-500" />
                  Monitor de riesgos
                </h3>
                {riskData.length > 0 && (
                  <div className="flex gap-2 text-xs font-semibold">
                    {riskData.filter(r => r.type === 'critical').length > 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-red-700">
                        {riskData.filter(r => r.type === 'critical').length} Críticos
                      </span>
                    )}
                    {riskData.filter(r => r.type !== 'critical').length > 0 && (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">
                        {riskData.filter(r => r.type !== 'critical').length} Alertas
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="max-h-[340px] flex-1 space-y-3 overflow-y-auto p-4">
                {riskData.length === 0 && (
                  <div className="flex h-full items-center justify-center py-12 text-center text-sm text-slate-400">
                    Sin riesgos activos en este momento.
                  </div>
                )}
                {riskData.map((risk) => (
                  <button
                    key={risk.id}
                    onClick={() => navigate(risk.to)}
                    className={`w-full rounded-lg border-l-4 p-3 text-left text-sm transition-colors hover:bg-slate-50 ${
                      risk.type === 'critical' ? 'border-red-500 bg-red-50/10' : 'border-amber-500 bg-amber-50/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={risk.type === 'critical' ? 'font-medium text-red-900' : 'font-medium text-amber-900'}>
                        {risk.message}
                      </p>
                      {risk.type === 'critical' ? <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" /> : null}
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      {risk.time}
                    </p>
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-100 bg-slate-50 p-3 text-center">
                <Link to="/director/authorization?status=all" className="text-xs font-semibold text-[#002B5B] hover:underline">
                  Ver matriz de riesgos completa
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-1">
              <h3 className="text-lg font-bold text-slate-900">Autorizaciones pendientes</h3>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <div className="rounded-lg bg-blue-50 p-2 text-[#002B5B]">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-blue-700">Listo para firmar</span>
                </div>
                <h4 className="mb-1 font-semibold text-slate-900">Cierre financiero mensual</h4>
                <p className="mb-4 text-xs text-slate-500">Periodo: Enero 2024 - Total: $425.8M</p>
                <button
                  onClick={() => navigate('/director/authorization?status=pending')}
                  className="w-full rounded-lg bg-[#002B5B] py-2 text-sm font-medium text-white transition-colors hover:bg-[#001F44]"
                >
                  Autorizar y firmar
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="rounded-lg bg-slate-200 p-2 text-slate-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-red-100 bg-red-50 px-2 py-1 text-[10px] font-bold uppercase text-red-600">Bloqueado</span>
                </div>
                <h4 className="mb-1 font-semibold text-slate-700">Expediente SECOP - Contrato de Obra</h4>
                <p className="mb-4 text-xs text-slate-500">Requiere corrección en consistencia documental y soporte contractual.</p>
                <button
                  onClick={() => navigate('/director/contract-file?contractId=CT-2023-089')}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[#002B5B] hover:text-[#002B5B]"
                >
                  Revisar expediente
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <h3 className="font-bold text-slate-900">Estado de contratos</h3>
                <div className="flex gap-2">
                  <button aria-label="Buscar contratos" className="text-slate-400 transition-colors hover:text-[#002B5B] cursor-pointer"><Search className="h-4 w-4" /></button>
                  <button aria-label="Configurar tabla" className="text-slate-400 transition-colors hover:text-[#002B5B] cursor-pointer"><Settings className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Contrato / Operador</th>
                      <th className="px-6 py-3 text-right font-semibold">Documentos</th>
                      <th className="px-6 py-3 text-center font-semibold">Conciliación</th>
                      <th className="px-6 py-3 text-center font-semibold">Cumplimiento</th>
                      <th className="px-6 py-3 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contractData.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                          Sin contratos registrados aún
                        </td>
                      </tr>
                    )}
                    {contractData.map((contract) => (
                      <tr
                        key={contract.id}
                        onClick={() => navigate(`/director/contract-file?contractId=${contract.id}`)}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(`/director/contract-file?contractId=${contract.id}`)}
                        tabIndex={0}
                        role="link"
                        aria-label={`Ver expediente del contrato ${contract.id}`}
                        className="cursor-pointer transition-colors hover:bg-slate-50/50 focus:outline-none focus:bg-slate-100"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{contract.id}</div>
                          <div className="text-xs text-slate-500">{contract.operator}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-700">{contract.documents}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            contract.balance === 'OK'
                              ? 'bg-emerald-100 text-emerald-800'
                              : contract.balance === 'Critico'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}>
                            {contract.balance}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${
                                  parseInt(contract.doc, 10) >= 90 ? 'bg-[#002B5B]' : parseInt(contract.doc, 10) >= 70 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: contract.doc }}
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-600">{contract.doc}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-md border px-2 py-1 text-xs font-medium ${
                            contract.status === 'Activo'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : contract.status === 'Bloqueado'
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                          }`}>
                            {contract.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 bg-slate-50 p-4 text-center">
                <Link to="/director/contract-file?contractId=CT-2023-089" className="mx-auto flex items-center justify-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-[#002B5B]">
                  Ver todos los contratos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
