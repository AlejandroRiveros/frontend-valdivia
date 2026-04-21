import React, { useMemo, useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Download, 
  History, 
  ChevronRight, 
  Paperclip,
  Calendar,
  DollarSign,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { Button } from '../components/ui/button';
import DirectorHeader from '../components/director/DirectorHeader';

// --- Types ---

interface Deliverable {
  id: string;
  contractId: string;
  contractor: string;
  type: string;
  month: string;
  submissionDate: string;
  docStatus: 'valid' | 'warning' | 'expired';
  balanceStatus: 'consistent' | 'inconsistent';
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
}

// --- Mock Data ---

const MOCK_DELIVERABLES: Deliverable[] = [
  {
    id: 'DEL-2023-089',
    contractId: 'CT-2023-001',
    contractor: 'Consorcio Infraestructura Norte',
    type: 'Informe Mensual de Supervisión',
    month: 'Septiembre 2023',
    submissionDate: '2023-10-05',
    docStatus: 'valid',
    balanceStatus: 'consistent',
    status: 'pending',
    amount: 15400000
  },
  {
    id: 'DEL-2023-090',
    contractId: 'CT-2023-002',
    contractor: 'Gestión Documental Integral S.A.S.',
    type: 'Certificación de Cumplimiento Contractual',
    month: 'Septiembre 2023',
    submissionDate: '2023-10-06',
    docStatus: 'warning',
    balanceStatus: 'consistent',
    status: 'pending',
    amount: 8200000
  },
  {
    id: 'DEL-2023-091',
    contractId: 'CT-2023-001',
    contractor: 'Consorcio Infraestructura Norte',
    type: 'Reporte de Novedades y Subsanaciones',
    month: 'Agosto 2023',
    submissionDate: '2023-09-05',
    docStatus: 'valid',
    balanceStatus: 'inconsistent',
    status: 'rejected',
    amount: 0
  }
];

export default function DirectorAuthorizationPage() {
  const [searchParams] = useSearchParams();
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [observation, setObservation] = useState('');
  const initialStatus = searchParams.get('status') ?? 'pending';
  const [filterStatus, setFilterStatus] = useState<string>(initialStatus);

  const filteredDeliverables = useMemo(() => {
    if (filterStatus === 'all') {
      return MOCK_DELIVERABLES;
    }

    return MOCK_DELIVERABLES.filter((item) => item.status === filterStatus);
  }, [filterStatus]);

  const handleReview = (item: Deliverable) => {
    setSelectedDeliverable(item);
  };

  const handleBack = () => {
    setSelectedDeliverable(null);
    setObservation('');
    setShowConfirmModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <DirectorHeader
        title="Autorización Documental y Pagos"
        subtitle="Seguimiento contractual, documental y financiero"
        backTo="/director/dashboard"
        rightContent={
          <>
            <div className="hidden lg:block mr-4">
              <select className="block w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-700 focus:border-[#002B5B] focus:ring-[#002B5B]">
                <option>Todos los Contratos</option>
                <option>CT-2023-001 (Infraestructura Norte)</option>
                <option>CT-2023-002 (Gestión Documental)</option>
              </select>
            </div>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Rol Activo</span>
              <span className="flex items-center gap-2 text-sm font-bold text-[#002B5B]">
                <ShieldCheck className="h-4 w-4" /> DIRECTOR OPERATIVO
              </span>
            </div>
            <Button variant="outline" className="hidden sm:flex border-slate-300 text-slate-600 hover:bg-slate-50">
              <History className="h-4 w-4 mr-2" /> Historial
            </Button>
          </>
        }
      />
      
      {/* 1. Header */}
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
              <h1 className="text-xl font-bold text-[#002B5B] leading-none">Autorización de Entregables</h1>
              <p className="text-sm text-slate-500 mt-1">Supervisión Contractual y Financiera</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Contract Selector */}
             <div className="hidden lg:block mr-4">
                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B] block w-full p-2.5">
                   <option>Todos los Contratos</option>
                   <option>CT-2023-001 (Infraestructura Norte)</option>
                   <option>CT-2023-002 (Gestión Documental)</option>
                </select>
             </div>

             <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rol Activo</span>
                <span className="text-sm font-bold text-[#002B5B] flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> DIRECTOR OPERATIVO
                </span>
             </div>
             <Button variant="outline" className="hidden sm:flex border-slate-300 text-slate-600 hover:bg-slate-50">
                <History className="h-4 w-4 mr-2" /> Historial
             </Button>
          </div>
        </div>
      </header>}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!selectedDeliverable ? (
          /* LIST VIEW */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4 w-full sm:w-auto">
                 <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar contrato o radicado..." 
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-[#002B5B] focus:border-[#002B5B]"
                    />
                 </div>
                 <select 
                    className="pl-3 pr-8 py-2 border border-slate-300 rounded-md text-sm focus:ring-[#002B5B] focus:border-[#002B5B] bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                 >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendientes de Revisión</option>
                    <option value="approved">Aprobados</option>
                    <option value="rejected">Rechazados</option>
                 </select>
               </div>
               
               <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Filter className="h-4 w-4" />
                  <span className="font-medium">{filteredDeliverables.length} entregables visibles</span>
               </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                       <tr>
                         <th className="px-6 py-4 font-bold tracking-wider">Radicado / Fecha</th>
                         <th className="px-6 py-4 font-bold tracking-wider">Contrato / Operador</th>
                         <th className="px-6 py-4 font-bold tracking-wider">Entregable</th>
                         <th className="px-6 py-4 font-bold tracking-wider text-center">Estado Documental</th>
                         <th className="px-6 py-4 font-bold tracking-wider text-center">Consistencia Contractual</th>
                         <th className="px-6 py-4 font-bold tracking-wider text-center">Acción</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {filteredDeliverables.map((item) => (
                         <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4">
                               <div className="font-bold text-[#002B5B]">{item.id}</div>
                               <div className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                                  <Calendar className="h-3 w-3" /> {item.submissionDate}
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="font-medium text-slate-800">{item.contractId}</div>
                               <div className="text-slate-500 text-xs">{item.contractor}</div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="font-medium text-slate-700">{item.type}</div>
                               <div className="text-xs text-slate-400 bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">
                                  {item.month}
                               </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <StatusBadge status={item.docStatus} type="doc" />
                            </td>
                            <td className="px-6 py-4 text-center">
                               <StatusBadge status={item.balanceStatus} type="balance" />
                            </td>
                            <td className="px-6 py-4 text-center">
                               <Button 
                                 size="sm" 
                                 onClick={() => handleReview(item)}
                                 className="bg-white border border-slate-300 text-slate-700 hover:bg-[#002B5B] hover:text-white hover:border-[#002B5B] transition-all"
                               >
                                 Revisar <ChevronRight className="h-3 w-3 ml-1" />
                               </Button>
                            </td>
                         </tr>
                       ))}
                       {filteredDeliverables.length === 0 && (
                         <tr>
                           <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                             No hay entregables para el filtro seleccionado.
                           </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        ) : (
          /* DETAIL VIEW (Split Screen) */
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
             
             {/* Breadcrumb / Back */}
             <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <button onClick={handleBack} className="hover:text-[#002B5B] hover:underline flex items-center gap-1">
                   Entregables
                </button>
                <ChevronRight className="h-3 w-3" />
                <span className="font-bold text-[#002B5B]">{selectedDeliverable.id}</span>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
                
                {/* LEFT PANEL: Documents & Info */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                   <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                      <h2 className="font-bold text-[#002B5B] flex items-center gap-2">
                         <FileText className="h-4 w-4" /> Documentación y Soportes
                      </h2>
                      <div className="flex gap-2">
                         <Button size="sm" variant="outline" className="h-8 text-xs">
                            <Download className="h-3 w-3 mr-1" /> Descargar Todo
                         </Button>
                      </div>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      
                      {/* Document Viewer Mock */}
                      <div className="bg-slate-100 rounded-lg border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                         <FileText className="h-12 w-12 text-slate-300 mb-3" />
                         <h3 className="text-slate-700 font-bold">Vista Previa del Documento</h3>
                         <p className="text-sm text-slate-500 max-w-xs mb-4">
                            {selectedDeliverable.type} - {selectedDeliverable.month}.pdf
                         </p>
                         <Button variant="outline" className="bg-white">
                            <Eye className="h-4 w-4 mr-2" /> Abrir en Visor Completo
                         </Button>
                      </div>

                      {/* Attached Files List */}
                      <div>
                         <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Archivos Adjuntos</h3>
                         <div className="space-y-2">
                            <AttachmentItem name="Informe_Tecnico_Oct2023.pdf" size="2.4 MB" type="pdf" />
                            <AttachmentItem name="Certificacion_ARL_Parafiscales.pdf" size="1.1 MB" type="pdf" />
                            <AttachmentItem name="Anexos_Contractuales.zip" size="15.8 MB" type="zip" />
                         </div>
                      </div>

                      {/* Observations History */}
                      <div>
                         <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Historial de Observaciones</h3>
                         <div className="space-y-3">
                            <div className="flex gap-3 text-sm">
                               <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-600">
                                  JS
                               </div>
                               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                     <span className="font-bold text-slate-700">Jurídica (J. Silva)</span>
                                     <span className="text-xs text-slate-400">Hace 2 días</span>
                                  </div>
                                  <p className="text-slate-600 leading-relaxed">
                                     La póliza de cumplimiento se encuentra vigente hasta Diciembre 2023. Documentación legal en orden.
                                  </p>
                               </div>
                            </div>
                         </div>
                      </div>

                   </div>
                </div>

                {/* RIGHT PANEL: Status & Decision */}
                <div className="flex flex-col gap-6 h-full">
                   
                   {/* Status Summary */}
                   <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex-shrink-0">
                      <h2 className="font-bold text-[#002B5B] mb-4 flex items-center gap-2">
                         <ShieldCheck className="h-4 w-4" /> Validación Normativa
                      </h2>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                         <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                            <span className="text-xs text-slate-500 uppercase font-bold mb-2">Estado Documental</span>
                            <StatusBadge status={selectedDeliverable.docStatus} type="doc" large />
                         </div>
                         <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                            <span className="text-xs text-slate-500 uppercase font-bold mb-2">Consistencia Contractual</span>
                            <StatusBadge status={selectedDeliverable.balanceStatus} type="balance" large />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <ChecklistItem label="Objeto contractual y acta de supervisión verificados" checked />
                         <ChecklistItem label="Certificaciones contractuales validadas" checked />
                         <ChecklistItem label="Pagos Seguridad Social al día" checked={selectedDeliverable.docStatus !== 'warning'} warning={selectedDeliverable.docStatus === 'warning'} />
                         <ChecklistItem label="Consistencia entre entregable, hito y valor" checked={selectedDeliverable.balanceStatus === 'consistent'} error={selectedDeliverable.balanceStatus !== 'consistent'} />
                      </div>
                   </div>

                   {/* Decision Module */}
                   <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex-1 flex flex-col">
                      <h2 className="font-bold text-[#002B5B] mb-4 flex items-center gap-2">
                         <Scale className="h-4 w-4" /> Dictamen y Autorización
                      </h2>

                      {/* Payment Info */}
                      <div className="bg-[#002B5B]/5 border border-[#002B5B]/10 rounded-lg p-4 mb-6">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-[#002B5B]">Monto a Autorizar</span>
                            <span className="text-xs text-[#002B5B]/70 uppercase font-bold">Moneda: COP</span>
                         </div>
                         <div className="text-2xl font-mono font-bold text-[#002B5B]">
                            $ {selectedDeliverable.amount.toLocaleString()}
                         </div>
                         <p className="text-xs text-slate-500 mt-1">
                            Contrato {selectedDeliverable.contractId} • Pago mensual recurrente
                         </p>
                      </div>

                      {/* Observation Input */}
                      <div className="mb-6 flex-1">
                         <label className="block text-sm font-bold text-slate-700 mb-2">
                            Observación del Director <span className="text-red-500">*</span>
                         </label>
                         <textarea 
                           className="w-full h-24 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-[#002B5B] focus:border-[#002B5B] resize-none"
                           placeholder="Ingrese sus comentarios para aprobación o rechazo..."
                           value={observation}
                           onChange={(e) => setObservation(e.target.value)}
                         ></textarea>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3 mt-auto">
                         <div className="grid grid-cols-2 gap-3">
                            <Button 
                              variant="outline" 
                              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                              disabled={!observation}
                              title={!observation ? "Requiere observación para rechazar" : ""}
                            >
                               Rechazar y Devolver
                            </Button>
                            <Button 
                               className="bg-[#002B5B] hover:bg-[#001F44] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                               disabled={selectedDeliverable.balanceStatus === 'inconsistent' || selectedDeliverable.docStatus === 'expired'}
                               onClick={() => setShowConfirmModal(true)}
                            >
                               Aprobar y Autorizar Pago
                            </Button>
                         </div>
                         
                         {selectedDeliverable.balanceStatus === 'inconsistent' && (
                            <p className="text-xs text-center text-red-600 font-medium bg-red-50 p-2 rounded">
                               <AlertTriangle className="h-3 w-3 inline mr-1" />
                               No es posible autorizar: Inconsistencias contractuales o documentales
                            </p>
                         )}
                      </div>
                   </div>

                </div>

             </div>
          </div>
        )}

      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedDeliverable && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                 <div className="h-16 w-16 bg-blue-50 text-[#002B5B] rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Confirmar Autorización de Pago</h3>
                 <p className="text-sm text-slate-500 mb-6">
                    Está por autorizar el pago de <strong>$ {selectedDeliverable.amount.toLocaleString()}</strong> asociado al contrato <strong>{selectedDeliverable.contractId}</strong>.
                    <br/><br/>
                    Esta acción es irreversible y quedará registrada en el sistema blockchain de auditoría.
                 </p>
                 
                 <div className="flex flex-col gap-3">
                    <Button 
                      className="w-full bg-[#002B5B] hover:bg-[#001F44] text-white h-12 text-base shadow-lg"
                      onClick={() => {
                        alert("Pago Autorizado Exitosamente");
                        handleBack();
                      }}
                    >
                       Confirmar y Firmar Digitalmente
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-slate-500 hover:text-slate-800"
                      onClick={() => setShowConfirmModal(false)}
                    >
                       Cancelar
                    </Button>
                 </div>
              </div>
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-center text-slate-400">
                 IP Auditada: 192.168.1.XX • {new Date().toLocaleDateString()}
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

// --- Sub-components ---

function StatusBadge({ status, type, large }: { status: string, type: 'doc' | 'balance', large?: boolean }) {
   if (type === 'doc') {
      if (status === 'valid') return <Badge color="green" icon={<CheckCircle className={large ? "h-5 w-5" : "h-3 w-3"} />} text="Documentación Vigente" large={large} />;
      if (status === 'warning') return <Badge color="amber" icon={<AlertTriangle className={large ? "h-5 w-5" : "h-3 w-3"} />} text="Revisión Pendiente" large={large} />;
      return <Badge color="red" icon={<XCircle className={large ? "h-5 w-5" : "h-3 w-3"} />} text="Documentos Vencidos" large={large} />;
   } else {
      if (status === 'consistent') return <Badge color="green" icon={<Scale className={large ? "h-5 w-5" : "h-3 w-3"} />} text="Consistencia Validada" large={large} />;
      return <Badge color="red" icon={<AlertTriangle className={large ? "h-5 w-5" : "h-3 w-3"} />} text="Inconsistencias Documentales" large={large} />;
   }
}

function Badge({ color, icon, text, large }: any) {
   const styles = {
      green: "bg-emerald-50 text-emerald-700 border-emerald-200",
      amber: "bg-amber-50 text-amber-700 border-amber-200",
      red: "bg-red-50 text-red-700 border-red-200",
   };
   
   return (
      <span className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-0.5 font-bold uppercase tracking-wide ${styles[color as keyof typeof styles]} ${large ? 'text-sm px-4 py-1.5' : 'text-[10px]'}`}>
         {icon}
         {text}
      </span>
   );
}

function AttachmentItem({ name, size, type }: any) {
   return (
      <div className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
         <div className="h-8 w-8 bg-slate-100 rounded flex items-center justify-center text-slate-500 mr-3 group-hover:bg-white group-hover:text-[#002B5B] transition-colors">
            {type === 'pdf' ? <FileText className="h-4 w-4" /> : <Paperclip className="h-4 w-4" />}
         </div>
         <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate group-hover:text-[#002B5B]">{name}</p>
            <p className="text-xs text-slate-400">{size} • {type.toUpperCase()}</p>
         </div>
         <Download className="h-4 w-4 text-slate-300 group-hover:text-[#002B5B]" />
      </div>
   );
}

function ChecklistItem({ label, checked, warning, error }: any) {
   let icon = <CheckCircle className="h-4 w-4 text-emerald-500" />;
   let textClass = "text-slate-700";
   
   if (warning) {
      icon = <AlertTriangle className="h-4 w-4 text-amber-500" />;
      textClass = "text-amber-800";
   } else if (error) {
      icon = <XCircle className="h-4 w-4 text-red-500" />;
      textClass = "text-red-700";
   }

   return (
      <div className={`flex items-start gap-3 p-2 rounded text-sm ${warning ? 'bg-amber-50' : error ? 'bg-red-50' : ''}`}>
         <div className="mt-0.5">{icon}</div>
         <span className={textClass}>{label}</span>
      </div>
   );
}
