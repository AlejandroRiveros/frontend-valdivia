import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  DollarSign, 
  PieChart, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  History, 
  Plus, 
  Save, 
  Download,
  FileSignature,
  Edit3,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { Button } from '../components/ui/Button';
import valdiviaLogo from '../../assets/9ea87c1c8d8e49e210fe4afd0e12a9f44fe0b8ee.png';
import DirectorHeader from '../components/director/DirectorHeader';

// --- Types ---

interface Deliverable {
  id: string;
  name: string;
  date: string;
  amount: number;
  status: 'pending' | 'delivered' | 'approved';
}

interface Modification {
  id: string;
  date: string;
  type: 'valor' | 'tiempo' | 'mixto';
  description: string;
  document: string;
  valueImpact: number;
  timeImpact: string;
  user: string;
}

interface AuditLog {
  id: string;
  date: string;
  action: string;
  user: string;
  details: string;
}

export default function ContractFilePage() {
  const [searchParams] = useSearchParams();
  const selectedContractId = searchParams.get('contractId') ?? 'CT-2023-089';

  // --- State ---
  
  // Contract Base Info
  const [contract, setContract] = useState({
    code: selectedContractId,
    status: 'execution' as 'execution' | 'suspended' | 'finished',
    startDate: '2023-01-15',
    endDate: '2023-12-31',
    totalValue: 1200000000, // 1.200 M
    contractor: 'Unión Temporal Aseo Norte',
    object: 'Prestación del servicio público de aseo y gestión integral de residuos sólidos en la zona norte.'
  });

  // Deliverables Plan
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: 'H1', name: 'Plan Operativo Inicial', date: '2023-02-01', amount: 120000000, status: 'approved' },
    { id: 'H2', name: 'Informe Trimestral Q1', date: '2023-04-15', amount: 300000000, status: 'approved' },
    { id: 'H3', name: 'Informe Trimestral Q2', date: '2023-07-15', amount: 300000000, status: 'approved' },
    { id: 'H4', name: 'Informe Trimestral Q3', date: '2023-10-15', amount: 300000000, status: 'pending' },
    { id: 'H5', name: 'Informe Final y Liquidación', date: '2023-12-30', amount: 180000000, status: 'pending' },
  ]);

  // Modifications (Otro Sí)
  const [modifications, setModifications] = useState<Modification[]>([]);
  const [showModForm, setShowModForm] = useState(false);
  const [newMod, setNewMod] = useState<Partial<Modification>>({ type: 'valor', valueImpact: 0 });

  // Audit Log
  const [auditLog] = useState<AuditLog[]>([
    { id: 'L1', date: '2023-10-01 09:30', action: 'Validación Hito', user: 'Director Operativo', details: 'Aprobación Informe Q3' },
    { id: 'L2', date: '2023-07-16 14:20', action: 'Pago Autorizado', user: 'Director Operativo', details: 'Autorización desembolso Hito 2' },
    { id: 'L3', date: '2023-01-15 08:00', action: 'Inicio Contrato', user: 'Admin Sistema', details: 'Cargue inicial del contrato' },
  ]);

  // --- Calculations ---

  const totalDeliverables = useMemo(() => deliverables.reduce((acc, curr) => acc + curr.amount, 0), [deliverables]);
  const executedValue = useMemo(() => deliverables.filter(d => d.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0), [deliverables]);
  const pendingValue = contract.totalValue - executedValue;
  const isBalanced = totalDeliverables === contract.totalValue;

  // --- Handlers ---

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setContract({ ...contract, status: e.target.value as any });
  };

  const handleDeliverableChange = (id: string, field: keyof Deliverable, value: any) => {
    setDeliverables(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleAddModification = () => {
    if (!newMod.description || !newMod.document) return; // Simple validation

    const mod: Modification = {
      id: `OS-${modifications.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      type: newMod.type as any,
      description: newMod.description || '',
      document: newMod.document || '',
      valueImpact: newMod.valueImpact || 0,
      timeImpact: newMod.timeImpact || 'N/A',
      user: 'Director Operativo'
    };

    setModifications([mod, ...modifications]);
    
    // Auto-recalculate budget if value impact
    if (mod.valueImpact !== 0) {
      setContract(prev => ({
        ...prev,
        totalValue: prev.totalValue + (mod.valueImpact || 0)
      }));
    }

    setShowModForm(false);
    setNewMod({ type: 'valor', valueImpact: 0 });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <DirectorHeader
        title={
          <div className="flex items-center gap-3">
            <span>Expediente Contractual</span>
            <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">
              {contract.code}
            </span>
          </div>
        }
        subtitle={
          <span className="flex items-center gap-2">
            <Briefcase className="h-3 w-3" /> {contract.contractor}
          </span>
        }
        backTo="/director/dashboard"
        rightContent={
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Estado actual</span>
              <select
                value={contract.status}
                onChange={handleStatusChange}
                className={`cursor-pointer appearance-none rounded-full border px-3 py-1.5 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-offset-1 ${
                  contract.status === 'execution'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-500'
                    : contract.status === 'suspended'
                      ? 'border-amber-200 bg-amber-50 text-amber-700 focus:ring-amber-500'
                      : 'border-slate-200 bg-slate-100 text-slate-600 focus:ring-slate-500'
                }`}
              >
                <option value="execution">En Ejecucion</option>
                <option value="suspended">Suspendido</option>
                <option value="finished">Finalizado</option>
              </select>
            </div>
            <div className="hidden flex-col items-end text-sm sm:flex">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Inicio: <strong>{contract.startDate}</strong></span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Fin: <strong>{contract.endDate}</strong></span>
              </div>
            </div>
          </div>
        }
      />
      
      {/* 1. HEADER */}
      {false && <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/director/dashboard" className="text-slate-400 hover:text-[#002B5B] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <img 
              src={valdiviaLogo} 
              alt="Logo VALDIVIA" 
              className="h-20 w-auto object-contain"
            />
            <div className="h-10 w-px bg-slate-200 mx-2"></div>
            <div>
              <div className="flex items-center gap-3">
                 <h1 className="text-xl font-bold text-[#002B5B] leading-none">Expediente Contractual</h1>
                 <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-600 border border-slate-200">
                    {contract.code}
                 </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                 <Briefcase className="h-3 w-3" /> {contract.contractor}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Estado Actual</span>
                <select 
                   value={contract.status}
                   onChange={handleStatusChange}
                   className={`text-xs font-bold uppercase rounded-full px-3 py-1.5 border appearance-none cursor-pointer focus:ring-2 focus:ring-offset-1 outline-none ${
                      contract.status === 'execution' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500' :
                      contract.status === 'suspended' ? 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-500' :
                      'bg-slate-100 text-slate-600 border-slate-200 focus:ring-slate-500'
                   }`}
                >
                   <option value="execution">● En Ejecución</option>
                   <option value="suspended">● Suspendido</option>
                   <option value="finished">● Finalizado</option>
                </select>
             </div>
             
             <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>

             <div className="hidden sm:flex flex-col items-end text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                   <Calendar className="h-4 w-4 text-slate-400" />
                   <span>Inicio: <strong>{contract.startDate}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 mt-1">
                   <Clock className="h-4 w-4 text-slate-400" />
                   <span>Fin: <strong>{contract.endDate}</strong></span>
                </div>
             </div>
          </div>
        </div>
      </header>}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 2. RESUMEN GENERAL (KPIs) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           
           <KPICard 
             label="Valor Total Contrato" 
             value={contract.totalValue} 
             icon={<DollarSign className="h-5 w-5" />} 
             color="blue"
             subtext="Incluye adiciones"
           />
           
           <KPICard 
             label="Monto Ejecutado" 
             value={executedValue} 
             icon={<PieChart className="h-5 w-5" />} 
             color="emerald"
             progress={(executedValue / contract.totalValue) * 100}
           />
           
           <KPICard 
             label="Saldo por Ejecutar" 
             value={pendingValue} 
             icon={<TrendingUp className="h-5 w-5" />} 
             color="slate"
           />

           <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Entregables</span>
                 <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <FileText className="h-5 w-5" />
                 </div>
              </div>
              <div className="flex items-end gap-2 mt-2">
                 <span className="text-2xl font-bold font-mono text-slate-800">
                    {deliverables.filter(d => d.status === 'approved').length}
                    <span className="text-slate-400 font-normal text-lg">/{deliverables.length}</span>
                 </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                 <div 
                   className="bg-indigo-500 h-1.5 rounded-full" 
                   style={{ width: `${(deliverables.filter(d => d.status === 'approved').length / deliverables.length) * 100}%` }}
                 ></div>
              </div>
           </div>

        </section>

        {/* Alert: Budget Consistency */}
        {!isBalanced && (
           <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 animate-pulse">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                 <h3 className="font-bold text-red-800">Inconsistencia Financiera Detectada</h3>
                 <p className="text-sm text-red-700">
                    La suma de los entregables (${totalDeliverables.toLocaleString()}) no coincide con el valor total del contrato (${contract.totalValue.toLocaleString()}).
                    Por favor ajuste los hitos o realice una modificación contractual (Otro Sí).
                 </p>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* 3. PLAN DE ENTREGABLES (Left Column - Wider) */}
           <div className="lg:col-span-2 space-y-6">
              <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                 <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-sm font-bold text-[#002B5B] uppercase tracking-wide flex items-center gap-2">
                       <FileText className="h-4 w-4" /> Plan de Entregables y Pagos
                    </h2>
                    <Button size="sm" variant="outline" className="h-8 text-xs border-slate-200 text-slate-600">
                       <Save className="h-3 w-3 mr-1" /> Guardar Cambios
                    </Button>
                 </div>
                 
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                          <tr>
                             <th className="px-4 py-3 font-bold w-12">ID</th>
                             <th className="px-4 py-3 font-bold">Hito / Entregable</th>
                             <th className="px-4 py-3 font-bold">Fecha Prog.</th>
                             <th className="px-4 py-3 font-bold text-right">Valor</th>
                             <th className="px-4 py-3 font-bold text-center">Estado</th>
                             <th className="px-4 py-3 font-bold w-10"></th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {deliverables.map((item) => (
                             <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-4 py-3 text-xs font-mono text-slate-500">{item.id}</td>
                                <td className="px-4 py-3">
                                   <input 
                                     type="text" 
                                     value={item.name}
                                     onChange={(e) => handleDeliverableChange(item.id, 'name', e.target.value)}
                                     className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-800 font-medium text-sm focus:underline"
                                   />
                                </td>
                                <td className="px-4 py-3">
                                   <input 
                                     type="date" 
                                     value={item.date}
                                     onChange={(e) => handleDeliverableChange(item.id, 'date', e.target.value)}
                                     className="bg-transparent border-none focus:ring-0 p-0 text-slate-600 text-xs font-mono"
                                   />
                                </td>
                                <td className="px-4 py-3 text-right">
                                   <input 
                                     type="number" 
                                     value={item.amount}
                                     onChange={(e) => handleDeliverableChange(item.id, 'amount', Number(e.target.value))}
                                     className="w-32 text-right bg-transparent border-b border-transparent focus:border-[#002B5B] focus:ring-0 p-0 text-slate-800 font-mono text-sm"
                                   />
                                </td>
                                <td className="px-4 py-3 text-center">
                                   <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                      item.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                                      'bg-slate-100 text-slate-600'
                                   }`}>
                                      {item.status === 'approved' ? 'Pagado' :
                                       item.status === 'delivered' ? 'Entregado' : 'Pendiente'}
                                   </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                   <button className="text-slate-300 hover:text-[#002B5B]">
                                      <Edit3 className="h-4 w-4" />
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                       <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-700">
                          <tr>
                             <td colSpan={3} className="px-4 py-3 text-right uppercase text-xs">Total Planificado:</td>
                             <td className={`px-4 py-3 text-right font-mono ${!isBalanced ? 'text-red-600' : 'text-slate-800'}`}>
                                $ {totalDeliverables.toLocaleString()}
                             </td>
                             <td colSpan={2}></td>
                          </tr>
                       </tfoot>
                    </table>
                 </div>
              </section>

              {/* 5. TRAZABILIDAD */}
              <section className="bg-white rounded-lg border border-slate-200 shadow-sm">
                 <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                       <History className="h-4 w-4" /> Auditoría y Trazabilidad
                    </h2>
                 </div>
                 <div className="divide-y divide-slate-100">
                    {auditLog.map((log) => (
                       <div key={log.id} className="px-6 py-3 flex items-start gap-4 hover:bg-slate-50 text-sm">
                          <div className="min-w-[120px] text-xs text-slate-500 font-mono mt-0.5">
                             {log.date}
                          </div>
                          <div className="flex-1">
                             <div className="flex items-center gap-2">
                                <span className="font-bold text-[#002B5B]">{log.action}</span>
                                <span className="text-xs px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">{log.user}</span>
                             </div>
                             <p className="text-slate-600 text-xs mt-1">{log.details}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* 4. MODIFICACIONES (Right Column) */}
           <div className="space-y-6">
              
              <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold text-[#002B5B] uppercase tracking-wide flex items-center gap-2">
                       <FileSignature className="h-4 w-4" /> Registro de Modificaciones
                    </h2>
                    {!showModForm && (
                       <Button size="sm" onClick={() => setShowModForm(true)} className="bg-slate-100 text-[#002B5B] hover:bg-slate-200 border-transparent">
                          <Plus className="h-3 w-3 mr-1" /> Registrar Otro Sí
                       </Button>
                    )}
                 </div>

                 {showModForm ? (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                       <h3 className="text-xs font-bold text-slate-700 uppercase mb-3">Nueva Modificación Contractual</h3>
                       <div className="space-y-3">
                          <div>
                             <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de Modificación</label>
                             <select 
                               className="w-full text-sm border-slate-300 rounded-md focus:ring-[#002B5B] focus:border-[#002B5B]"
                               value={newMod.type}
                               onChange={(e) => setNewMod({...newMod, type: e.target.value as any})}
                             >
                                <option value="valor">Adición Presupuestal</option>
                                <option value="tiempo">Prórroga en Tiempo</option>
                                <option value="mixto">Mixta (Valor + Tiempo)</option>
                             </select>
                          </div>

                          {(newMod.type === 'valor' || newMod.type === 'mixto') && (
                             <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Impacto Financiero (Adición)</label>
                                <input 
                                  type="number" 
                                  className="w-full text-sm border-slate-300 rounded-md focus:ring-[#002B5B] focus:border-[#002B5B]"
                                  placeholder="Monto a adicionar"
                                  value={newMod.valueImpact}
                                  onChange={(e) => setNewMod({...newMod, valueImpact: Number(e.target.value)})}
                                />
                             </div>
                          )}

                          {(newMod.type === 'tiempo' || newMod.type === 'mixto') && (
                             <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Impacto en Cronograma</label>
                                <input 
                                  type="text" 
                                  className="w-full text-sm border-slate-300 rounded-md focus:ring-[#002B5B] focus:border-[#002B5B]"
                                  placeholder="Ej: +3 Meses (Nueva fecha: ...)"
                                  value={newMod.timeImpact}
                                  onChange={(e) => setNewMod({...newMod, timeImpact: e.target.value})}
                                />
                             </div>
                          )}

                          <div>
                             <label className="block text-xs font-medium text-slate-600 mb-1">Justificación / Descripción</label>
                             <textarea 
                               className="w-full text-sm border-slate-300 rounded-md focus:ring-[#002B5B] focus:border-[#002B5B] h-20 resize-none"
                               value={newMod.description}
                               onChange={(e) => setNewMod({...newMod, description: e.target.value})}
                             ></textarea>
                          </div>

                          <div>
                             <label className="block text-xs font-medium text-slate-600 mb-1">Documento Soporte (Obligatorio)</label>
                             <div className="flex items-center gap-2">
                                <input 
                                  type="file" 
                                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  onChange={(e) => setNewMod({...newMod, document: e.target.value})}
                                />
                             </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                             <Button size="sm" onClick={handleAddModification} className="flex-1 bg-[#002B5B] text-white">
                                Confirmar Cambio
                             </Button>
                             <Button size="sm" variant="outline" onClick={() => setShowModForm(false)} className="flex-1">
                                Cancelar
                             </Button>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       {modifications.length === 0 ? (
                          <div className="text-center py-8 bg-slate-50 rounded border border-dashed border-slate-200">
                             <p className="text-xs text-slate-400">No se han registrado modificaciones (Otro Sí)</p>
                          </div>
                       ) : (
                          modifications.map((mod) => (
                             <div key={mod.id} className="p-3 bg-white border border-slate-200 rounded-lg hover:border-[#002B5B] transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                   <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{mod.id}</span>
                                   <span className="text-[10px] text-slate-400">{mod.date}</span>
                                </div>
                                <h4 className="text-sm font-bold text-[#002B5B] mb-1">
                                   {mod.type === 'valor' ? 'Adición Presupuestal' : mod.type === 'tiempo' ? 'Prórroga' : 'Adición y Prórroga'}
                                </h4>
                                <p className="text-xs text-slate-600 mb-2 line-clamp-2">{mod.description}</p>
                                
                                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 mt-2">
                                   {mod.valueImpact > 0 && (
                                      <span className="font-mono text-emerald-600 font-bold">
                                         + $ {mod.valueImpact.toLocaleString()}
                                      </span>
                                   )}
                                   <div className="flex gap-2">
                                      <button className="text-blue-600 hover:underline flex items-center gap-1">
                                         <Download className="h-3 w-3" /> Soporte
                                      </button>
                                   </div>
                                </div>
                             </div>
                          ))
                       )}
                    </div>
                 )}
                 
                 {/* Summary of Impact */}
                 {modifications.length > 0 && (
                     <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100 text-xs text-blue-800">
                        <strong>Impacto Acumulado:</strong> Se han adicionado <strong>$ {modifications.reduce((acc, curr) => acc + (curr.valueImpact || 0), 0).toLocaleString()}</strong> al contrato original.
                     </div>
                 )}
              </section>

              {/* Documentation Quick Links */}
              <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                 <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Documentación Legal</h2>
                 <ul className="space-y-2">
                    <li className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer group">
                       <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400 group-hover:text-[#002B5B]" />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900">Minuta del Contrato</span>
                       </div>
                       <Download className="h-3 w-3 text-slate-300" />
                    </li>
                    <li className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer group">
                       <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400 group-hover:text-[#002B5B]" />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900">Póliza de Cumplimiento</span>
                       </div>
                       <Download className="h-3 w-3 text-slate-300" />
                    </li>
                    <li className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer group">
                       <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400 group-hover:text-[#002B5B]" />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900">Acta de Inicio</span>
                       </div>
                       <Download className="h-3 w-3 text-slate-300" />
                    </li>
                 </ul>
              </section>

           </div>

        </div>

      </main>
    </div>
  );
}

// --- Components ---

function KPICard({ label, value, icon, color, progress, subtext }: any) {
  const colors = {
    blue: "bg-blue-50 text-[#002B5B] border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };
  
  const activeColor = colors[color as keyof typeof colors] || colors.slate;

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
       <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
          <div className={`p-2 rounded-lg ${activeColor}`}>
             {icon}
          </div>
       </div>
       <div className="mt-2">
          <div className="text-2xl font-bold font-mono text-slate-800 tracking-tight">
             $ {(value / 1000000).toLocaleString()} <span className="text-sm text-slate-400 font-normal">M</span>
          </div>
          {subtext && <p className="text-[10px] text-slate-400 mt-1">{subtext}</p>}
       </div>
       {progress !== undefined && (
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
             <div 
               className={`h-1.5 rounded-full ${color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'}`} 
               style={{ width: `${progress}%` }}
             ></div>
          </div>
       )}
    </div>
  );
}
