import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Scale, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Camera, 
  Ban, 
  Info,
  Save,
  Factory
} from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/Button';

// Interfaces for type safety
interface MaterialRow {
  id: number;
  type: string;
  subtype: string;
  weight: number;
  observation: string;
}

export default function EcaClassificationPage() {
  // --- State Management ---
  
  // General Info
  const [ecaId, setEcaId] = useState('');
  const [scaleId, setScaleId] = useState('');
  const [scaleStatus, setScaleStatus] = useState<'valid' | 'expired' | 'unknown'>('unknown');
  const [entryWeight, setEntryWeight] = useState<number>(0); // Peso bruto de entrada (referencia)
  
  // Material Classification
  const [materials, setMaterials] = useState<MaterialRow[]>([
    { id: 1, type: '', subtype: '', weight: 0, observation: '' }
  ]);
  
  // Rejection
  const [hasRejection, setHasRejection] = useState(false);
  const [rejectionWeight, setRejectionWeight] = useState<number>(0);
  const [rejectionReason, setRejectionReason] = useState('');

  // Calculations
  const [totalClassified, setTotalClassified] = useState(0);
  const [totalCalculated, setTotalCalculated] = useState(0);
  const [difference, setDifference] = useState(0);
  const [consistency, setConsistency] = useState<'consistent' | 'warning' | 'error'>('consistent');

  // --- Effects & Logic ---

  // Mock Scale Validation Logic
  useEffect(() => {
    if (scaleId === 'SCL-001') setScaleStatus('valid');
    else if (scaleId === 'SCL-002') setScaleStatus('expired'); // Simulate expired cert
    else setScaleStatus('unknown');
  }, [scaleId]);

  // Mass Balance Calculation
  useEffect(() => {
    const matSum = materials.reduce((acc, curr) => acc + (curr.weight || 0), 0);
    setTotalClassified(matSum);
    
    const calculated = matSum + (hasRejection ? (rejectionWeight || 0) : 0);
    setTotalCalculated(calculated);
    
    const diff = entryWeight - calculated;
    setDifference(diff);

    // Consistency Logic (Threshold 1% tolerance)
    if (entryWeight === 0) {
        setConsistency('consistent'); // Default
    } else {
        const diffAbs = Math.abs(diff);
        const tolerance = entryWeight * 0.01;
        
        if (diffAbs === 0) setConsistency('consistent');
        else if (diffAbs <= tolerance) setConsistency('warning');
        else setConsistency('error');
    }
  }, [materials, rejectionWeight, hasRejection, entryWeight]);

  // Handlers
  const addMaterialRow = () => {
    setMaterials([...materials, { 
      id: Date.now(), 
      type: '', 
      subtype: '', 
      weight: 0, 
      observation: '' 
    }]);
  };

  const removeMaterialRow = (id: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const updateMaterial = (id: number, field: keyof MaterialRow, value: any) => {
    setMaterials(materials.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const isFormValid = 
    scaleStatus === 'valid' && 
    ecaId !== '' && 
    entryWeight > 0 && 
    totalClassified > 0 &&
    consistency !== 'error';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
      {/* 1. Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/operative/dashboard" className="text-slate-500 hover:text-[#002B5B] transition-colors p-2 -ml-2 rounded-full hover:bg-slate-50">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#002B5B] leading-none">Clasificación y Pesaje ECA</h1>
              <p className="text-xs text-slate-500 mt-1">Control de Aprovechamiento • Dec. 596</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Contract Status */}
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estado Contractual</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> VIGENTE
                </span>
             </div>
             <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
             {/* Doc Compliance */}
             <div className="flex items-center gap-2" title="Cumplimiento Documental">
                <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm border border-emerald-200"></div>
                <div className="h-3 w-3 rounded-full bg-slate-200"></div>
                <div className="h-3 w-3 rounded-full bg-slate-200"></div>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* 2. General Info & Scale Validation */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                    <Info className="h-4 w-4" /> Datos de Ingreso
                </h2>
                <span className="text-xs font-mono text-slate-400">REF: ECA-{new Date().getFullYear()}-0089</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase">ECA de Destino</label>
                    <div className="relative">
                        <select 
                            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-[#002B5B] focus:border-[#002B5B]"
                            value={ecaId}
                            onChange={(e) => setEcaId(e.target.value)}
                        >
                            <option value="">Seleccione ECA...</option>
                            <option value="ECA-CENTRO">ECA Centro - NU: 99281</option>
                            <option value="ECA-NORTE">ECA Norte - NU: 88123</option>
                        </select>
                        <Factory className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Báscula Utilizada</label>
                    <div className="relative">
                        <select 
                            className={`w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:outline-none ${
                                scaleStatus === 'expired' 
                                ? 'border-red-300 bg-red-50 text-red-700 focus:ring-red-500' 
                                : 'border-slate-300 focus:ring-[#002B5B] focus:border-[#002B5B]'
                            }`}
                            value={scaleId}
                            onChange={(e) => setScaleId(e.target.value)}
                        >
                            <option value="">Seleccione Báscula...</option>
                            <option value="SCL-001">Báscula #1 (Cert. Vigente)</option>
                            <option value="SCL-002">Báscula #2 (Cert. Vencido)</option>
                        </select>
                        <Scale className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    </div>
                    {scaleStatus === 'expired' && (
                        <p className="text-[10px] font-bold text-red-600 flex items-center gap-1 animate-pulse">
                            <Ban className="h-3 w-3" /> BLOQUEO: Equipo sin calibración vigente.
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Peso Bruto Entrada (Kg)</label>
                    <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono focus:ring-[#002B5B] focus:border-[#002B5B]"
                        onChange={(e) => setEntryWeight(parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-[10px] text-slate-400">Peso total reportado en ingreso</p>
                </div>

            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 3. Classification Table */}
            <div className="lg:col-span-2 space-y-6">
                <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Clasificación de Materiales</h2>
                        <Button size="sm" variant="outline" onClick={addMaterialRow} className="text-[#002B5B] border-slate-200 hover:bg-slate-50">
                            <Plus className="h-3 w-3 mr-1" /> Agregar Fila
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-3 w-[180px]">Familia</th>
                                    <th className="px-4 py-3">Subtipo</th>
                                    <th className="px-4 py-3 w-[120px]">Peso (Kg)</th>
                                    <th className="px-4 py-3">Observación</th>
                                    <th className="px-4 py-3 w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {materials.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-2">
                                            <select 
                                                className="w-full border border-slate-200 rounded px-2 py-1.5 focus:border-[#002B5B] focus:ring-1 focus:ring-[#002B5B] outline-none"
                                                value={row.type}
                                                onChange={(e) => updateMaterial(row.id, 'type', e.target.value)}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="PLASTICO">Plástico</option>
                                                <option value="PAPEL">Papel / Cartón</option>
                                                <option value="VIDRIO">Vidrio</option>
                                                <option value="METAL">Metales</option>
                                                <option value="OTRO">Otros</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input 
                                                type="text" 
                                                placeholder="Ej. PET Cristal"
                                                className="w-full border border-slate-200 rounded px-2 py-1.5 focus:border-[#002B5B] outline-none"
                                                value={row.subtype}
                                                onChange={(e) => updateMaterial(row.id, 'subtype', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input 
                                                type="number" 
                                                className="w-full border border-slate-200 rounded px-2 py-1.5 font-mono text-right focus:border-[#002B5B] outline-none"
                                                placeholder="0"
                                                value={row.weight || ''}
                                                onChange={(e) => updateMaterial(row.id, 'weight', parseFloat(e.target.value))}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input 
                                                type="text" 
                                                className="w-full border-none bg-transparent text-slate-500 focus:text-slate-900 outline-none text-xs"
                                                placeholder="Observaciones..."
                                                value={row.observation}
                                                onChange={(e) => updateMaterial(row.id, 'observation', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {materials.length > 1 && (
                                                <button onClick={() => removeMaterialRow(row.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-700">
                                <tr>
                                    <td colSpan={2} className="px-4 py-3 text-right uppercase text-xs">Total Clasificado:</td>
                                    <td className="px-4 py-3 text-right font-mono">{totalClassified.toFixed(2)}</td>
                                    <td colSpan={2}></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </section>

                {/* 4. Rejection Section */}
                <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800 uppercase flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            Registro de Rechazo
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500">¿Hubo material rechazado?</span>
                            <button 
                                type="button"
                                onClick={() => setHasRejection(!hasRejection)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#002B5B] ${hasRejection ? 'bg-[#002B5B]' : 'bg-slate-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasRejection ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    {hasRejection && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-600">Peso Rechazado (Kg)</label>
                                <input 
                                    type="number" 
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                                    placeholder="0.00"
                                    value={rejectionWeight || ''}
                                    onChange={(e) => setRejectionWeight(parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-600">Motivo de Rechazo</label>
                                <select 
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                >
                                    <option value="">Seleccione motivo...</option>
                                    <option value="HUMEDAD">Exceso de humedad</option>
                                    <option value="CONTAMINACION">Contaminación cruzada</option>
                                    <option value="NO_APROVECHABLE">Material no aprovechable</option>
                                    <option value="PELIGROSO">Residuo Peligroso</option>
                                </select>
                            </div>
                            <div className="sm:col-span-2 p-3 bg-amber-50 border border-amber-100 rounded text-xs text-amber-800">
                                <strong>Nota:</strong> El material de rechazo debe ser dispuesto según la Macroruta de recolección ordinaria.
                            </div>
                        </div>
                    )}
                </section>
                
                {/* 6. Evidence Upload */}
                 <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center gap-2">
                        <Camera className="h-4 w-4" /> Soportes de Trazabilidad
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer h-32">
                            <Camera className="h-6 w-6 text-slate-400 mb-2" />
                            <span className="text-xs font-medium text-slate-600">Foto Material</span>
                         </div>
                         <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer h-32">
                            <Scale className="h-6 w-6 text-slate-400 mb-2" />
                            <span className="text-xs font-medium text-slate-600">Foto Báscula</span>
                         </div>
                         <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer h-32">
                            <FileText className="h-6 w-6 text-slate-400 mb-2" />
                            <span className="text-xs font-medium text-slate-600">Planilla Física</span>
                         </div>
                    </div>
                </section>
            </div>

            {/* 5. Summary & Consistency Panel (Sticky Sidebar) */}
            <aside className="space-y-6">
                <div className="bg-[#002B5B] rounded-lg shadow-lg text-white p-6 sticky top-24">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-6 opacity-80 border-b border-white/20 pb-2">Balance de Masas</h3>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="opacity-70">Peso Ingreso (Bruto):</span>
                            <span className="font-mono font-bold text-lg">{entryWeight.toFixed(2)} <span className="text-xs opacity-50">Kg</span></span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                            <span className="opacity-70">Total Clasificado:</span>
                            <span className="font-mono font-bold text-lg">{totalClassified.toFixed(2)} <span className="text-xs opacity-50">Kg</span></span>
                        </div>

                        {hasRejection && (
                            <div className="flex justify-between items-center text-sm text-amber-300">
                                <span className="opacity-70">Total Rechazo:</span>
                                <span className="font-mono font-bold text-lg">{rejectionWeight.toFixed(2)} <span className="text-xs opacity-50">Kg</span></span>
                            </div>
                        )}

                        <div className="border-t border-white/20 my-4"></div>

                        <div className="flex justify-between items-center">
                            <span className="text-xs uppercase font-bold tracking-wide">Diferencia:</span>
                            <span className={`font-mono text-xl font-bold ${
                                difference === 0 ? 'text-emerald-400' :
                                consistency === 'error' ? 'text-red-400' : 'text-amber-400'
                            }`}>
                                {(difference > 0 ? '+' : '') + difference.toFixed(2)} Kg
                            </span>
                        </div>
                    </div>

                    {/* Traffic Light Status */}
                    <div className="mt-6 pt-4 border-t border-white/20">
                        <div className={`flex items-center gap-3 p-3 rounded-md ${
                            consistency === 'consistent' ? 'bg-emerald-500/20 border border-emerald-500/30' :
                            consistency === 'warning' ? 'bg-amber-500/20 border border-amber-500/30' :
                            'bg-red-500/20 border border-red-500/30'
                        }`}>
                            <div className={`h-4 w-4 rounded-full flex-shrink-0 ${
                                consistency === 'consistent' ? 'bg-emerald-400' :
                                consistency === 'warning' ? 'bg-amber-400' :
                                'bg-red-500'
                            }`} />
                            <div>
                                <p className={`text-xs font-bold uppercase ${
                                    consistency === 'consistent' ? 'text-emerald-100' :
                                    consistency === 'warning' ? 'text-amber-100' :
                                    'text-red-100'
                                }`}>
                                    {consistency === 'consistent' ? 'Balance Consistente' :
                                     consistency === 'warning' ? 'Revisar Diferencias' :
                                     'Inconsistencia Grave'}
                                </p>
                                <p className="text-[10px] opacity-70 leading-tight mt-1">
                                    {consistency === 'consistent' ? 'El peso distribuido coincide con el ingreso.' :
                                     consistency === 'warning' ? 'Existe una variación leve aceptable.' :
                                     'La diferencia excede el margen de tolerancia (1%).'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 7. Action Buttons */}
                    <div className="mt-8 space-y-3">
                        <Button 
                            className="w-full bg-white text-[#002B5B] hover:bg-slate-100 font-bold"
                            disabled={!isFormValid}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Registrar Ingreso
                        </Button>
                        <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white">
                            Guardar Borrador
                        </Button>
                    </div>
                </div>

                <div className="p-4 bg-slate-100 rounded-lg text-xs text-slate-500 text-center leading-relaxed">
                    <p>
                        Este registro tiene carácter legal ante la SSPD. 
                        Asegure la veracidad de la información ingresada.
                        <br />
                        <strong>IP Auditada:</strong> 192.168.1.XX
                    </p>
                </div>
            </aside>

        </div>

      </main>
    </div>
  );
}
