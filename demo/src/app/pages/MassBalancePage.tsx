import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  Ban, 
  Info, 
  FileCheck,
  Calendar,
  Filter,
  Download,
  Activity
} from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';

export default function MassBalancePage() {
  // Mock Data for demonstration
  const [currentMonth] = useState('Enero 2024');
  
  // Summary Data
  const summary = {
    collected: 128,
    classified: 119,
    rejected: 6,
    commercialized: 87, // Approved documents ready for payment
    difference: 3, // Pending documents to reconcile
    differencePercent: 2.4, // percentage of pending documents
  };

  // Determine global status based on difference
  const globalStatus = summary.differencePercent <= 1 ? 'optimal' : summary.differencePercent <= 5 ? 'warning' : 'critical';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      
      {/* 1. Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/operative/dashboard" className="text-slate-500 hover:text-[#002B5B] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#002B5B] leading-none flex items-center gap-3">
                Consistencia Contractual
                <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                   {currentMonth}
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">Control documental • Contratos gubernamentales</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Global Status Indicator */}
             <div className="flex flex-col items-end mr-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Estado de Consistencia</span>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                    globalStatus === 'optimal' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                    globalStatus === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    'bg-red-50 border-red-200 text-red-700'
                }`}>
                    <div className={`h-2.5 w-2.5 rounded-full ${
                         globalStatus === 'optimal' ? 'bg-emerald-500' :
                         globalStatus === 'warning' ? 'bg-amber-500' :
                         'bg-red-500'
                    } animate-pulse`}></div>
                    <span className="text-xs font-bold uppercase">
                        {globalStatus === 'optimal' ? 'Consistente' : globalStatus === 'warning' ? 'Revisión Requerida' : 'Inconsistencia Grave'}
                    </span>
                </div>
             </div>

             <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>

             {/* Contract Status */}
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Contrato</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    VIGENTE
                </span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* 2. Resumen General (KPI Cards) */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard 
                label="Docs Radicados" 
                value={summary.collected} 
                unit="Docs" 
                icon={<Activity className="h-4 w-4" />}
                color="blue"
            />
            <StatCard 
                label="Docs Validados" 
                value={summary.classified} 
                unit="Docs" 
                icon={<Scale className="h-4 w-4" />}
                color="blue"
            />
            <StatCard 
                label="Subsanaciones" 
                value={summary.rejected} 
                unit="Docs" 
                icon={<Ban className="h-4 w-4" />}
                color="amber"
            />
             <StatCard 
                label="Autorizados" 
                value={summary.commercialized} 
                unit="Docs" 
                icon={<CheckCircle className="h-4 w-4" />}
                color="emerald"
            />
            <StatCard 
                label="Pendientes" 
                value={summary.difference} 
                unit="Docs" 
                subValue={`${summary.differencePercent}%`}
                icon={<AlertTriangle className="h-4 w-4" />}
                color={globalStatus === 'optimal' ? 'emerald' : globalStatus === 'warning' ? 'amber' : 'red'}
                isAlert
            />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* 3. Tabla Técnica Detallada */}
            <div className="xl:col-span-2 space-y-6">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2">
                             <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Detalle de Radicados</h2>
                             <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-bold">Enero</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button variant="ghost" size="sm" className="h-8 text-slate-500 border-slate-200 hover:bg-white">
                                <Filter className="h-3 w-3 mr-1" /> Filtrar
                             </Button>
                             <Button variant="outline" size="sm" className="h-8 text-[#002B5B] border-slate-200 bg-white hover:bg-slate-50">
                                <Download className="h-3 w-3 mr-1" /> Exportar
                             </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Fecha</th>
                                    <th className="px-4 py-3 font-medium">Área</th>
                                    <th className="px-4 py-3 font-medium">Documento</th>
                                    <th className="px-4 py-3 text-right font-medium">Radicados</th>
                                    <th className="px-4 py-3 text-right font-medium">Validados</th>
                                    <th className="px-4 py-3 text-right font-medium">Obs.</th>
                                    <th className="px-4 py-3 text-right font-medium">Pend.</th>
                                    <th className="px-4 py-3 text-center font-medium">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <TableRow date="15/01" route="Supervisión" material="Informe mensual" col={12} cla={12} rej={0} diff={0} status="ok" />
                                <TableRow date="15/01" route="Jurídica" material="Póliza de cumplimiento" col={4} cla={4} rej={0} diff={0} status="ok" />
                                <TableRow date="14/01" route="Financiera" material="Cuenta de cobro" col={8} cla={7} rej={1} diff={0} status="warning" />
                                <TableRow date="14/01" route="Contratación" material="Otro sí" col={6} cla={6} rej={0} diff={0} status="ok" />
                                <TableRow date="13/01" route="Archivo" material="Acta de inicio" col={5} cla={5} rej={0} diff={0} status="ok" />
                                <TableRow date="12/01" route="Financiera" material="CDP / RP" col={7} cla={5} rej={1} diff={-1} status="error" />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Column: Consistency & Alerts */}
            <aside className="space-y-6">
                
                {/* 4. Panel de Consistencia Automática */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center gap-2">
                        <Activity className="h-4 w-4" /> Regla de Consistencia
                    </h3>
                    
                    <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-100">
                        <div className="flex flex-col items-center justify-center space-y-2 font-mono text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">Radicados</span>
                                <span>=</span>
                                <span className="text-[#002B5B]">Validados</span>
                                <span>+</span>
                                <span className="text-amber-600">Observados</span>
                            </div>
                            <div className="w-full h-px bg-slate-300"></div>
                            <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                                Tolerancia de pendientes documentales: +/- 5%
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded border-l-4 ${
                        globalStatus === 'optimal' ? 'bg-emerald-50 border-l-emerald-500 text-emerald-800' :
                        globalStatus === 'warning' ? 'bg-amber-50 border-l-amber-500 text-amber-800' :
                        'bg-red-50 border-l-red-600 text-red-800'
                    }`}>
                        <div className="flex items-start gap-3">
                            {globalStatus === 'optimal' && <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                            {globalStatus === 'warning' && <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                            {globalStatus === 'critical' && <Ban className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                            
                            <div>
                                <h4 className="font-bold text-sm">
                                    {globalStatus === 'optimal' ? 'Expediente Consistente' :
                                     globalStatus === 'warning' ? 'Pendientes Detectados' :
                                     'Inconsistencia Documental Crítica'}
                                </h4>
                                <p className="text-xs mt-1 opacity-90 leading-snug">
                                    {globalStatus === 'optimal' ? 'Los documentos pendientes están dentro del rango aceptable (< 1%).' :
                                     globalStatus === 'warning' ? 'Existen pendientes por subsanar, pero dentro del margen de control (< 5%).' :
                                     'Los pendientes superan el 5% permitido. Se bloquea la autorización hasta subsanar.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Alertas Normativas */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Validaciones Documentales</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        <AlertItem 
                            label="Pendientes documentales < 5%" 
                            status={summary.differencePercent < 5 ? 'pass' : 'fail'} 
                        />
                        <AlertItem 
                            label="Firmas digitales validadas" 
                            status="pass" 
                        />
                        <AlertItem 
                            label="Expediente actualizado en SECOP" 
                            status="pass" 
                        />
                         <AlertItem 
                            label="Pólizas vigentes" 
                            status="warning"
                            detail="Póliza P-002 próxima a vencer" 
                        />
                         <AlertItem 
                            label="Soportes presupuestales" 
                            status="fail"
                            detail="Faltan 2 CDP/RP"
                        />
                    </div>
                </div>

                {/* 6. Trazabilidad */}
                <div className="text-center space-y-1 pt-4">
                    <p className="text-[10px] text-slate-400 font-mono">
                        Validación generada automáticamente el {new Date().toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-slate-400">
                        Usuario consulta: Carlos Rodríguez
                    </p>
                    <div className="flex justify-center items-center gap-2 mt-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                        <span className="text-[10px] text-slate-300 uppercase tracking-widest">Sistema Auditado</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                    </div>
                </div>

            </aside>

        </div>

      </main>
    </div>
  );
}

// Sub-components

function StatCard({ label, value, unit, subValue, icon, color, isAlert }: any) {
    const colors = {
        blue: "text-[#002B5B] bg-blue-50 border-blue-100",
        emerald: "text-emerald-700 bg-emerald-50 border-emerald-100",
        amber: "text-amber-700 bg-amber-50 border-amber-100",
        red: "text-red-700 bg-red-50 border-red-100",
    };

    const activeColor = colors[color as keyof typeof colors] || colors.blue;

    return (
        <div className={`p-4 rounded-lg border shadow-sm flex flex-col justify-between h-28 relative overflow-hidden ${isAlert ? activeColor : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-start z-10">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isAlert ? '' : 'text-slate-500'}`}>{label}</span>
                <div className={`p-1.5 rounded-full ${isAlert ? 'bg-white/50' : 'bg-slate-100 text-slate-400'}`}>
                    {icon}
                </div>
            </div>
            <div className="z-10 mt-auto">
                <div className={`text-2xl font-bold font-mono tracking-tight ${isAlert ? '' : 'text-slate-800'}`}>
                    {value.toLocaleString()} <span className="text-xs font-normal opacity-70">{unit}</span>
                </div>
                {subValue && (
                    <div className={`text-xs font-bold mt-0.5 ${isAlert ? '' : 'text-slate-400'}`}>
                        {subValue} <span className="font-normal opacity-70">Desviación</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function TableRow({ date, route, material, col, cla, rej, diff, status }: any) {
    const statusColor = 
        status === 'ok' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
        status === 'warning' ? 'text-amber-600 bg-amber-50 border-amber-100' : 
        'text-red-600 bg-red-50 border-red-100';

    const diffColor = diff === 0 ? 'text-slate-300' : diff < 0 ? 'text-red-500' : 'text-emerald-500';

    return (
        <tr className="hover:bg-slate-50 transition-colors border-b border-slate-50">
            <td className="px-4 py-3 text-slate-500 text-xs">{date}</td>
            <td className="px-4 py-3 text-slate-700 font-mono text-xs">{route}</td>
            <td className="px-4 py-3 font-medium text-slate-800">{material}</td>
            <td className="px-4 py-3 text-right font-mono text-slate-600">{col}</td>
            <td className="px-4 py-3 text-right font-mono text-slate-600">{cla}</td>
            <td className="px-4 py-3 text-right font-mono text-slate-400">{rej}</td>
            <td className={`px-4 py-3 text-right font-mono font-bold ${diffColor}`}>{diff > 0 ? '+' : ''}{diff}</td>
            <td className="px-4 py-3 text-center">
                <div className={`inline-flex h-2 w-2 rounded-full ${
                     status === 'ok' ? 'bg-emerald-500' : 
                     status === 'warning' ? 'bg-amber-500' : 
                     'bg-red-500'
                }`}></div>
            </td>
        </tr>
    );
}

function AlertItem({ label, status, detail }: { label: string, status: 'pass' | 'fail' | 'warning', detail?: string }) {
    const icon = 
        status === 'pass' ? <CheckCircle className="h-4 w-4 text-emerald-500" /> :
        status === 'warning' ? <AlertTriangle className="h-4 w-4 text-amber-500" /> :
        <Ban className="h-4 w-4 text-red-500" />;

    return (
        <div className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
            <div className="mt-0.5">{icon}</div>
            <div>
                <p className={`text-xs font-bold ${status === 'fail' ? 'text-red-700' : status === 'warning' ? 'text-amber-800' : 'text-slate-700'}`}>
                    {label}
                </p>
                {detail && <p className="text-[10px] text-slate-500 mt-0.5">{detail}</p>}
            </div>
        </div>
    );
}
