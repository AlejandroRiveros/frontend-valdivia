import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Scale, 
  FileText, 
  Camera, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Truck,
  UploadCloud,
  X,
  Navigation
} from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/Button';
import valdiviaLogo from '../../assets/9ea87c1c8d8e49e210fe4afd0e12a9f44fe0b8ee.png';

export default function CollectionRegistrationPage() {
  // Mock state for demonstration
  const [contractStatus] = useState<'active' | 'inactive'>('active');
  const [arlStatus] = useState<'valid' | 'expired' | 'warning'>('warning'); 
  const [weight, setWeight] = useState('');
  const [showWeightWarning, setShowWeightWarning] = useState(false);
  const [selectedMicroroute, setSelectedMicroroute] = useState('');
  const [macroroute, setMacroroute] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Handle weight change to simulate validation
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWeight(val);
    if (Number(val) > 500) { 
      setShowWeightWarning(true);
    } else {
      setShowWeightWarning(false);
    }
  };

  // Auto-fill Macroroute based on Microroute
  useEffect(() => {
    if (selectedMicroroute === 'MR-001') setMacroroute('MACRO-CENTRO (Zona A)');
    else if (selectedMicroroute === 'MR-002') setMacroroute('MACRO-NORTE (Industrial)');
    else if (selectedMicroroute === 'MR-003') setMacroroute('MACRO-OCCIDENTE (Residencial)');
    else setMacroroute('');
  }, [selectedMicroroute]);

  const handleUpload = () => {
    // Simulate upload
    setTimeout(() => {
      setUploadedFile('evidencia_ruta_001.jpg');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* 1. Header Navigation */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/operative/dashboard" className="text-slate-500 hover:text-[#002B5B] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#002B5B] leading-none">Registrar Recolección</h1>
              <p className="text-xs text-slate-500 mt-1">Gestión de Aprovechamiento (Dec. 596/2016)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
               contractStatus === 'active' 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                : 'bg-red-50 border-red-100 text-red-700'
             }`}>
              <span className={`h-2 w-2 rounded-full ${contractStatus === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <span className="text-xs font-bold uppercase tracking-wide">
                {contractStatus === 'active' ? 'Contrato Activo' : 'Contrato Inactivo'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* 2. Validations / Alerts Area */}
        {contractStatus === 'inactive' && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r shadow-sm flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-800">Contrato Suspendido o Inactivo</h3>
              <p className="text-sm text-red-700 mt-1">
                No es posible registrar nuevas operaciones hasta normalizar su situación contractual. Contacte a supervisión.
              </p>
            </div>
          </div>
        )}

        {arlStatus === 'warning' && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r shadow-sm flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-800">Alerta de Seguridad Social</h3>
              <p className="text-sm text-amber-700 mt-1">
                Su certificación de ARL vence en 5 días. Por favor actualice sus documentos legales para evitar bloqueos en el sistema.
              </p>
            </div>
          </div>
        )}

        {/* 3. Main Form */}
        <form className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative" onSubmit={(e) => e.preventDefault()}>
          {contractStatus === 'inactive' && (
            <div className="absolute inset-0 bg-white/60 z-10 cursor-not-allowed"></div>
          )}
          
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
             <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
               <Truck className="h-4 w-4" /> Datos de la Ruta
             </h2>
             <span className="text-xs text-slate-500 font-mono">ID: REG-{new Date().getTime().toString().slice(-6)}</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Fecha y Hora */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Fecha de Recolección</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B] focus:border-transparent cursor-pointer"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Microruta Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Microruta Asignada</label>
              <div className="relative">
                <select 
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B] focus:border-transparent appearance-none bg-white"
                  value={selectedMicroroute}
                  onChange={(e) => setSelectedMicroroute(e.target.value)}
                >
                  <option value="">Seleccione una microruta...</option>
                  <option value="MR-001">MR-001: Centro Histórico - Sector A</option>
                  <option value="MR-002">MR-002: Zona Industrial Norte</option>
                  <option value="MR-003">MR-003: Residencial Los Álamos</option>
                </select>
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Macroruta (Auto) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Macroruta (Automático)</label>
              <div className={`w-full px-3 py-2 border border-slate-200 rounded-md text-sm ${macroroute ? 'bg-blue-50 text-[#002B5B] font-medium' : 'bg-slate-100 text-slate-500'}`}>
                {macroroute || 'Seleccione microruta para visualizar...'}
              </div>
            </div>

            {/* Ubicación GPS */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Ubicación (GPS)</label>
              <div className="flex gap-2">
                 <input 
                  type="text" 
                  readOnly
                  placeholder="Coordenadas no detectadas"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm bg-slate-50 text-slate-500"
                />
                <Button type="button" size="sm" className="shrink-0 w-auto px-3 bg-[#002B5B] text-white border-transparent hover:bg-[#001F44]">
                  <Navigation className="h-4 w-4 mr-1" /> Detectar
                </Button>
              </div>
            </div>

             <div className="md:col-span-2 border-t border-slate-100 my-2"></div>

            {/* Tipo de Material */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-3">Tipo de Material Principal</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {['Plástico', 'Papel', 'Metal', 'Vidrio', 'Orgánico'].map((type) => (
                  <label 
                    key={type} 
                    className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition-all ${
                      materialType === type 
                        ? 'border-[#002B5B] bg-blue-50 text-[#002B5B] ring-1 ring-[#002B5B]' 
                        : 'border-slate-200 hover:border-[#002B5B] hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="material" 
                      className="sr-only" 
                      checked={materialType === type}
                      onChange={() => setMaterialType(type)}
                    />
                    <span className="text-sm font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Peso Estimado */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Peso Estimado (Kg)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={weight}
                  onChange={handleWeightChange}
                  placeholder="0.00"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B] focus:border-transparent ${
                    showWeightWarning ? 'border-amber-300 bg-amber-50' : 'border-slate-300'
                  }`}
                />
                <Scale className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">KG</span>
              </div>
              {showWeightWarning && (
                <p className="text-xs text-amber-700 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  El peso ingresado supera el promedio histórico (500kg). Se requerirá validación adicional.
                </p>
              )}
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Observaciones Operativas</label>
              <textarea 
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B] focus:border-transparent h-[100px] resize-none"
                placeholder="Detalles sobre el estado del material, novedades en la ruta, etc..."
              ></textarea>
            </div>

             <div className="md:col-span-2 border-t border-slate-100 my-2"></div>
            
            {/* Adjuntar Evidencia */}
            <div className="md:col-span-2 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Evidencia Fotográfica y Soportes</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Upload Zone 1: Photo */}
                <div 
                  onClick={handleUpload}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-[#002B5B] hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                    <Camera className="h-6 w-6 text-slate-400 group-hover:text-[#002B5B]" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Tomar o subir foto</p>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG (Max. 5MB)</p>
                </div>

                {/* Upload Zone 2: Document */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-[#002B5B] hover:bg-slate-50 transition-colors cursor-pointer group">
                   <div className="p-3 bg-slate-100 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                    <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-[#002B5B]" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Adjuntar Planilla</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, Documento escaneado</p>
                </div>
              </div>

              {/* Upload Success Simulation */}
              {uploadedFile && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-md mt-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-slate-200 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=100" alt="Preview" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-800">{uploadedFile}</p>
                      <p className="text-[10px] text-emerald-600">Carga exitosa • 2.4 MB</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setUploadedFile(null)}
                    className="text-emerald-700 hover:text-emerald-900 p-1 hover:bg-emerald-100 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

            </div>

          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 z-10">
            <Button variant="outline" className="text-slate-600 border-slate-300 bg-white">
              Guardar Borrador
            </Button>
            <Button 
              className="bg-[#002B5B] hover:bg-[#001F44] text-white min-w-[180px]"
              disabled={contractStatus === 'inactive'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Registrar Recolección
            </Button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-400 mt-8 pb-8">
          Plataforma VALDIVIA • Gestión Institucional de Residuos • Versión 1.0.4
        </div>

      </main>
    </div>
  );
}
