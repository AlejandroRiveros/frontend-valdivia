import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  FileText, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight,
  Briefcase,
  Building,
  UserCheck,
  Shield,
  Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import valdiviaLogo from '../../assets/9ea87c1c8d8e49e210fe4afd0e12a9f44fe0b8ee.png';
import DirectorHeader from '../components/director/DirectorHeader';
import { apiFetch } from '../../lib/api';

// --- Types ---

interface TeamMember {
  id: string;
  name: string;
  role: string;
  activeProcesses: number;
  avatar: string;
}

interface ProcessFormData {
  name: string;
  entity: string;
  modality: string;
  budget: number;
  startDate: string;
  endDate: string;
  description: string;
  analystId: string;
  operatorId: string;
  supervisorRole: boolean;
  accessLevel: 'read' | 'write' | 'admin';
}

const MOCK_OPERATORS = [
  { id: 'OP-01', name: 'Unión Temporal Aseo Norte' },
  { id: 'OP-02', name: 'Recuperadora del Valle SAS' },
  { id: 'OP-03', name: 'EcoServicios Ltda.' },
];

const INTERNAL_BUDGET_LIMIT = 5000000000; // 5.000 M

export default function NewTenderProcessPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [analysts, setAnalysts] = useState<TeamMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [formData, setFormData] = useState<ProcessFormData>({
    name: '',
    entity: 'Alcaldía Municipal',
    modality: 'Licitación Pública',
    budget: 0,
    startDate: '',
    endDate: '',
    description: '',
    analystId: '',
    operatorId: '',
    supervisorRole: false,
    accessLevel: 'write'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProcessFormData, string>>>({});

  useEffect(() => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setGeneratedId(`LP-${year}-${random}`);

    apiFetch('/users')
      .then(r => r.json())
      .then((users: Array<{ id: string; name: string; role: string; activeProcesses: number; avatar: string }>) => {
        const mapped = users
          .filter(u => u.role === 'ANALYST')
          .map(u => ({ id: u.id, name: u.name, role: 'Analista', activeProcesses: u.activeProcesses ?? 0, avatar: u.avatar ?? u.name.substring(0, 2).toUpperCase() }));
        setAnalysts(mapped);
      })
      .catch(() => setAnalysts([]));
  }, []);

  // --- Validations ---

  const validateStep1 = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = 'El nombre del proceso es obligatorio';
    if (!formData.entity) newErrors.entity = 'Debe seleccionar una entidad';
    if (!formData.modality) newErrors.modality = 'Seleccione la modalidad';
    if (formData.budget <= 0) newErrors.budget = 'El presupuesto debe ser mayor a 0';
    if (!formData.startDate) newErrors.startDate = 'Fecha de apertura requerida';
    if (!formData.endDate) newErrors.endDate = 'Fecha de cierre requerida';
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'La fecha de cierre debe ser posterior a la apertura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};
    if (!formData.analystId) newErrors.analystId = 'Debe asignar un analista responsable';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    if (validateStep2()) {
      setShowConfirmModal(true);
    }
  };

  const confirmCreation = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await apiFetch('/tender-processes', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          entity: formData.entity,
          modality: formData.modality,
          budget: formData.budget,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          analystId: formData.analystId,
          operatorId: formData.operatorId || null,
          supervisorRole: formData.supervisorRole,
          accessLevel: formData.accessLevel,
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Error al crear el proceso');
        return;
      }
      setGeneratedId(data.process.generatedId);
      setShowConfirmModal(false);
      navigate('/director/dashboard');
    } catch {
      setSubmitError('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAnalyst = analysts.find(a => a.id === formData.analystId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <DirectorHeader
        title="Iniciar Nuevo Proceso"
        subtitle="Gestion estrategica del director"
        backTo="/director/dashboard"
        maxWidthClassName="max-w-5xl"
        rightContent={
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold uppercase text-slate-400">Paso {step} de 2</p>
              <p className="text-sm font-bold text-[#002B5B]">{step === 1 ? 'Datos Generales' : 'Asignacion de Equipo'}</p>
            </div>
            <div className="flex gap-1">
              <div className={`h-2 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-[#002B5B]' : 'bg-slate-200'}`} />
              <div className={`h-2 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-[#002B5B]' : 'bg-slate-200'}`} />
            </div>
          </div>
        }
      />
      
      {/* 1. Header */}
      {false && <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/director/dashboard" className="text-slate-400 hover:text-[#002B5B] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <img 
              src={valdiviaLogo} 
              alt="Logo VALDIVIA" 
              className="h-12 w-auto object-contain"
            />
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div>
              <h1 className="text-lg font-bold text-[#002B5B] leading-none">Iniciar Nuevo Proceso</h1>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">Gestión Estratégica del Director</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400 font-bold uppercase">Paso {step} de 2</p>
                <p className="text-sm font-bold text-[#002B5B]">{step === 1 ? 'Datos Generales' : 'Asignación de Equipo'}</p>
             </div>
             <div className="flex gap-1">
                <div className={`h-2 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-[#002B5B]' : 'bg-slate-200'}`}></div>
                <div className={`h-2 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-[#002B5B]' : 'bg-slate-200'}`}></div>
             </div>
          </div>
        </div>
      </header>}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Process ID Badge */}
        <div className="flex justify-center mb-8">
           <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
              <span className="text-xs text-slate-500 uppercase font-bold">ID Preliminar:</span>
              <span className="text-sm font-mono font-bold text-[#002B5B]">{generatedId}</span>
           </div>
        </div>

        {step === 1 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300 space-y-6">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                   <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#002B5B]" />
                      Datos Generales del Proceso
                   </h2>
                </div>
                
                <div className="p-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      
                      {/* Process Name */}
                      <div className="md:col-span-2">
                         <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Proceso <span className="text-red-500">*</span></label>
                         <input 
                           type="text" 
                           className={`w-full px-4 py-2 border rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B] ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                           placeholder="Ej: Licitación Aseo Urbano Zona Norte 2024"
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                         />
                         {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                      </div>

                      {/* Entity */}
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Entidad Contratante <span className="text-red-500">*</span></label>
                         <div className="relative">
                            <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <select 
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B]"
                              value={formData.entity}
                              onChange={(e) => setFormData({...formData, entity: e.target.value})}
                            >
                               <option>Alcaldía Municipal</option>
                               <option>Secretaría de Hacienda</option>
                               <option>Empresa de Servicios Públicos</option>
                            </select>
                         </div>
                      </div>

                      {/* Modality */}
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Modalidad <span className="text-red-500">*</span></label>
                         <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <select 
                              className={`w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B] ${errors.modality ? 'border-red-300' : ''}`}
                              value={formData.modality}
                              onChange={(e) => setFormData({...formData, modality: e.target.value})}
                            >
                               <option value="">Seleccione Modalidad...</option>
                               <option>Licitación Pública</option>
                               <option>Selección Abreviada</option>
                               <option>Concurso de Méritos</option>
                               <option>Contratación Directa</option>
                            </select>
                         </div>
                         {errors.modality && <p className="text-xs text-red-500 mt-1">{errors.modality}</p>}
                      </div>

                      {/* Budget */}
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Presupuesto Estimado (COP) <span className="text-red-500">*</span></label>
                         <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input 
                              type="number" 
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B] font-mono ${errors.budget ? 'border-red-300' : 'border-slate-300'}`}
                              placeholder="0"
                              value={formData.budget || ''}
                              onChange={(e) => setFormData({...formData, budget: Number(e.target.value)})}
                            />
                         </div>
                         {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget}</p>}
                         {formData.budget > INTERNAL_BUDGET_LIMIT && (
                            <div className="flex items-start gap-2 mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-xs text-amber-800">
                               <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                               <span>El presupuesto supera el límite interno de aprobación automática ($5.000M). Requerirá validación adicional del Comité Financiero.</span>
                            </div>
                         )}
                      </div>

                      {/* Description */}
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Objeto / Descripción</label>
                         <textarea 
                           className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B] h-[100px] resize-none"
                           placeholder="Breve descripción del alcance..."
                           value={formData.description}
                           onChange={(e) => setFormData({...formData, description: e.target.value})}
                         ></textarea>
                      </div>

                      {/* Dates */}
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Fecha Apertura <span className="text-red-500">*</span></label>
                         <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input 
                              type="date" 
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B] ${errors.startDate ? 'border-red-300' : 'border-slate-300'}`}
                              value={formData.startDate}
                              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                            />
                         </div>
                         {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                      </div>

                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-1">Fecha Cierre (Estimada) <span className="text-red-500">*</span></label>
                         <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input 
                              type="date" 
                              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B] ${errors.endDate ? 'border-red-300' : 'border-slate-300'}`}
                              value={formData.endDate}
                              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            />
                         </div>
                         {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                      </div>

                   </div>
                </div>
                
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-end">
                   <Button onClick={handleNext} className="bg-[#002B5B] text-white hover:bg-[#001F44]">
                      Continuar a Asignación <ChevronRight className="h-4 w-4 ml-2" />
                   </Button>
                </div>
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-right-4 fade-in duration-300 space-y-6">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                   <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#002B5B]" />
                      Asignación de Equipo y Responsabilidades
                   </h2>
                   <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-slate-500">
                      Editar Paso Anterior
                   </Button>
                </div>
                
                <div className="p-8 space-y-8">
                   
                   {/* Analyst Selection */}
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Analista Responsable (Líder del Proceso) <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {analysts.map((analyst) => (
                            <div 
                              key={analyst.id}
                              onClick={() => setFormData({...formData, analystId: analyst.id})}
                              className={`cursor-pointer rounded-lg border p-4 relative transition-all ${
                                 formData.analystId === analyst.id 
                                 ? 'border-[#002B5B] bg-blue-50/50 shadow-sm ring-1 ring-[#002B5B]' 
                                 : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                               <div className="flex items-center gap-3 mb-3">
                                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${formData.analystId === analyst.id ? 'bg-[#002B5B] text-white' : 'bg-slate-200 text-slate-600'}`}>
                                     {analyst.avatar}
                                  </div>
                                  <div>
                                     <p className="font-bold text-sm text-slate-900">{analyst.name}</p>
                                     <p className="text-xs text-slate-500">{analyst.role}</p>
                                  </div>
                               </div>
                               
                               <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100/50">
                                  <span className="text-slate-500">Carga Actual:</span>
                                  <span className={`font-bold px-2 py-0.5 rounded-full ${
                                     analyst.activeProcesses >= 4 ? 'bg-red-100 text-red-700' : 
                                     analyst.activeProcesses >= 2 ? 'bg-amber-100 text-amber-700' : 
                                     'bg-emerald-100 text-emerald-700'
                                  }`}>
                                     {analyst.activeProcesses} procesos
                                  </span>
                               </div>
                               
                               {formData.analystId === analyst.id && (
                                  <div className="absolute top-2 right-2 text-[#002B5B]">
                                     <CheckCircle className="h-5 w-5" />
                                  </div>
                               )}
                            </div>
                         ))}
                      </div>
                      {errors.analystId && <p className="text-xs text-red-500 mt-2">{errors.analystId}</p>}
                      
                      {selectedAnalyst && selectedAnalyst.activeProcesses >= 4 && (
                         <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-sm text-red-800">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <p><strong>Advertencia de Sobrecarga:</strong> {selectedAnalyst.name} tiene una carga alta de trabajo. Considere reasignar o necesitará aprobación del Gerente.</p>
                         </div>
                      )}
                   </div>

                   {/* Operator & Supervisor */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Operador Asignado (Opcional)</label>
                         <div className="relative">
                            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <select 
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B]"
                              value={formData.operatorId}
                              onChange={(e) => setFormData({...formData, operatorId: e.target.value})}
                            >
                               <option value="">-- Por definir en adjudicación --</option>
                               {MOCK_OPERATORS.map(op => (
                                  <option key={op.id} value={op.id}>{op.name}</option>
                               ))}
                            </select>
                         </div>
                         <p className="text-xs text-slate-500 mt-1">Si es una licitación abierta, deje este campo vacío.</p>
                      </div>

                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Nivel de Acceso y Permisos</label>
                         <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 mb-2">
                               <Shield className="h-4 w-4 text-slate-500" />
                               <span className="text-sm font-medium text-slate-700">Role Based Access Control (RBAC)</span>
                            </div>
                            <div className="space-y-2">
                               <label className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name="accessLevel" 
                                    className="text-[#002B5B] focus:ring-[#002B5B]" 
                                    checked={formData.accessLevel === 'write'}
                                    onChange={() => setFormData({...formData, accessLevel: 'write'})}
                                  />
                                  <span className="text-xs text-slate-600">Edición Total (Supervisor)</span>
                               </label>
                               <label className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name="accessLevel" 
                                    className="text-[#002B5B] focus:ring-[#002B5B]"
                                    checked={formData.accessLevel === 'read'}
                                    onChange={() => setFormData({...formData, accessLevel: 'read'})}
                                  />
                                  <span className="text-xs text-slate-600">Solo Lectura (Auditor)</span>
                               </label>
                            </div>
                         </div>
                      </div>
                   </div>

                </div>
                
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex justify-between items-center">
                   <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-600">
                      <ArrowLeft className="h-4 w-4 mr-2" /> Atrás
                   </Button>
                   <Button onClick={handleSubmit} className="bg-[#002B5B] text-white hover:bg-[#001F44] px-8">
                      Crear Proceso Oficial
                   </Button>
                </div>
             </div>
          </div>
        )}

      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 text-center">
                 <div className="h-16 w-16 bg-blue-50 text-[#002B5B] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Confirmar Creación de Proceso</h3>
                 <p className="text-sm text-slate-500 mb-6">
                    El proceso <strong>{generatedId}</strong> será creado y notificado automáticamente al equipo asignado.
                    <br/><br/>
                    <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-medium text-xs border border-slate-200">
                       Responsable: {selectedAnalyst?.name}
                    </span>
                 </p>
                 
                 {submitError && (
                   <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 text-center">
                     {submitError}
                   </div>
                 )}
                 <div className="flex flex-col gap-3">
                    <Button
                      className="w-full bg-[#002B5B] hover:bg-[#001F44] text-white h-12 text-base shadow-lg"
                      onClick={confirmCreation}
                      disabled={isSubmitting}
                    >
                       {isSubmitting ? (
                         <span className="flex items-center gap-2">
                           <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           Guardando...
                         </span>
                       ) : 'Confirmar y Notificar'}
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
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-center text-slate-400 flex items-center justify-center gap-2">
                 <Info className="h-3 w-3" /> Acción registrada por: Director Operativo
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
