import React from 'react';
import { 
  Bell, 
  LogOut, 
  FileText, 
  Upload, 
  AlertTriangle, 
  Calendar, 
  Briefcase, 
  Download, 
  CheckCircle,
  Clock,
  ChevronRight,
  FileWarning,
  Paperclip,
  Truck,
  Scale,
  MapPin,
  Factory,
  Ban,
  FileCheck,
  RefreshCw,
  Search,
  MessageSquare,
  ArrowRight,
  MoreHorizontal,
  Activity
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router';
import valdiviaLogo from '../../assets/9ea87c1c8d8e49e210fe4afd0e12a9f44fe0b8ee.png';
import { downloadJsonFile, downloadTextFile } from '../../lib/file-actions';

export default function OperativeDashboardPage() {
  const navigate = useNavigate();

  const userStr = localStorage.getItem('valdivia_user');
  let user: { name?: string; role?: string } | null = null;
  try { user = userStr ? JSON.parse(userStr) : null; } catch { /* corrupted */ }
  const userName = user?.name || 'Analista';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('valdivia_token');
    localStorage.removeItem('valdivia_user');
    navigate('/');
  };

  const handleTemplateDownload = () => {
    downloadTextFile(
      'plantilla-radicacion-contractual.txt',
      [
        'Plantilla base de radicación contractual',
        '1. Numero de contrato',
        '2. Tipo documental',
        '3. Fecha del soporte',
        '4. Area responsable',
        '5. Observaciones y anexos',
      ].join('\n'),
    );
  };

  const handleExportHistory = () => {
    downloadJsonFile('historial-gestion-documental.json', {
      exportedAt: new Date().toISOString(),
      user: userName,
      events: [
        { date: '20 Oct, 14:30', event: 'Radicación contractual', contract: 'CT-892', detail: 'Minuta y anexos', docs: '12 docs', status: 'Validado' },
        { date: '20 Oct, 09:15', event: 'Revisión jurídica', contract: 'CT-892', detail: 'Póliza de cumplimiento', docs: '4 docs', status: 'Validado' },
        { date: '19 Oct, 16:45', event: 'Subsanación', contract: 'CT-892', detail: 'CDP faltante', docs: '1 soporte', status: 'Devuelto' },
        { date: '18 Oct, 10:00', event: 'Control documental', contract: 'General', detail: 'Seguridad Social', docs: '2 docs', status: 'Pendiente' },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-800">
      {/* 1. Header SaaS */}
      <header className="bg-white border-b border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] sticky top-0 z-30 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img 
              src={valdiviaLogo} 
              alt="Logo VALDIVIA" 
              className="h-16 w-auto object-contain"
            />
            <div className="h-5 w-px bg-slate-200 hidden md:block"></div>
            <div className="hidden md:block">
              <h1 className="text-sm font-bold text-[#002B5B] tracking-tight">
                VALDIVIA
              </h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Panel de Gestión Documental
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
             {/* Indicador de Estado Discreto */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Gestión Documental Activa</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                aria-label="Notificaciones"
                onClick={() => navigate('/operative/deliverables')}
                className="relative text-slate-400 hover:text-[#002B5B] transition-colors p-1.5 hover:bg-slate-50 rounded-md"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-slate-800 text-xs leading-none">{userName}</p>
                  <p className="text-slate-400 text-[10px] mt-1 leading-none">Panel Operativo</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-[#002B5B] text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                  {userInitials}
                </div>
              </div>

              <button
                aria-label="Cerrar sesión"
                className="text-slate-300 hover:text-red-600 transition-colors ml-1"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 2. Tarjetas de Estado (Jerarquía Visual Mejorada) */}
        <section className="space-y-4">
           {/* Fila Principal */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatusCard 
                title="Documentación Legal" 
                value="Vigente" 
                trend="Actualizado hace 2d"
                status="success"
                icon={<FileText className="h-4 w-4" />}
              />
              <StatusCard
                title="Cumplimiento Documental"
                value="En revisión"
                trend="2 soportes requieren subsanación"
                status="warning"
                icon={<FileWarning className="h-4 w-4" />}
                highlight
              />
              <StatusCard 
                title="Observaciones" 
                value="1 Pendiente" 
                trend="Requiere respuesta urgente"
                status="danger"
                icon={<MessageSquare className="h-4 w-4" />}
              />
           </div>

           {/* Fila Secundaria */}
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MiniStatusCard 
                label="Entregables" 
                value="2 Pendientes" 
                icon={<Upload className="h-3 w-3" />} 
                color="amber"
              />
              <MiniStatusCard 
                label="Próximo Vencimiento" 
                value="15 Oct - ARL" 
                icon={<Calendar className="h-3 w-3" />} 
                color="blue"
              />
               <MiniStatusCard 
                label="Informe Contractual" 
                value="En Borrador" 
                icon={<FileCheck className="h-3 w-3" />} 
                color="slate"
              />
           </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          <div className="xl:col-span-3 space-y-8">
            
            {/* 3. Acciones Principales (Estilo Botones SaaS) */}
            <div className="space-y-6">
              
              {/* Grupo: Gestión Documental Contractual */}
              <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-1">
                <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                   <h3 className="text-xs font-bold text-[#002B5B] uppercase tracking-wider flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" /> Gestión Documental Contractual
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">Periodo activo: Enero 2024</span>
                </div>
                
                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ActionButton
                    icon={<Upload />}
                    label="Radicar Documento"
                    desc="Contrato o anexo"
                    variant="normal"
                    href="/operative/collection"
                  />
                  <ActionButton
                    icon={<Search />}
                    label="Revisar Soportes"
                    desc="Checklist legal"
                    variant="active"
                    href="/operative/eca-classification"
                  />
                  <ActionButton
                    icon={<FileCheck />}
                    label="Conciliar Hitos"
                    desc="Pagos y entregables"
                    variant="critical"
                    href="/operative/mass-balance"
                  />
                  <ActionButton
                    icon={<Briefcase />}
                    label="Expediente Digital"
                    desc="Mis procesos"
                    variant="normal"
                    href="/operative/processes"
                  />
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Grupo: Documentación */}
                <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" /> Documentación Legal
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <SecondaryActionButton icon={<Upload />} label="Cargar Docs" to="/operative/collection" />
                    <SecondaryActionButton icon={<RefreshCw />} label="Actualizar" onClick={() => window.location.reload()} highlight />
                    <SecondaryActionButton icon={<Download />} label="Plantillas" onClick={handleTemplateDownload} />
                  </div>
                </section>

                {/* Grupo: Gestión Contractual */}
                <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5" /> Gestión Contractual
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <SecondaryActionButton icon={<Search />} label="Contratos" to="/operative/processes" />
                    <SecondaryActionButton icon={<Upload />} label="Entregables" to="/operative/deliverables" />
                    <SecondaryActionButton icon={<MessageSquare />} label="Observaciones" to="/operative/eca-classification" />
                  </div>
                </section>
              </div>

            </div>

            {/* 4. Flujo documental visual */}
            <section className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Trazabilidad del Expediente</h3>
                 <span className="text-[10px] bg-slate-50 text-slate-400 px-2 py-1 rounded border border-slate-100">ID: EXP-2024-001</span>
              </div>
              
              <div className="relative flex flex-col md:flex-row justify-between items-center gap-4 px-4">
                {/* Linea de conexión sutil */}
                <div className="absolute top-1/2 left-4 right-4 h-px bg-slate-100 -z-0 hidden md:block transform -translate-y-1/2"></div>
                
                <FlowStep step="01" label="Radicación" status="completed" icon={<FileText className="h-3.5 w-3.5" />} />
                <FlowStep step="02" label="Revisión" status="completed" icon={<Search className="h-3.5 w-3.5" />} />
                <FlowStep step="03" label="Subsanación" status="active" icon={<MessageSquare className="h-3.5 w-3.5" />} />
                <FlowStep step="04" label="Firma" status="pending" icon={<FileCheck className="h-3.5 w-3.5" />} />
                <FlowStep step="05" label="Archivo" status="locked" icon={<Briefcase className="h-3.5 w-3.5" />} />
              </div>
            </section>

            {/* 5. Tabla de Actividad Reciente (Estilo SaaS Clean) */}
            <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white">
                <div>
                   <h3 className="text-sm font-bold text-slate-800">Registro de Actividad</h3>
                   <p className="text-[10px] text-slate-400 mt-0.5">Últimos movimientos auditados</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleExportHistory} className="h-8 text-xs border-slate-200 text-slate-600 hover:text-[#002B5B]">
                   Exportar Historial
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-50 font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Fecha</th>
                      <th className="px-6 py-3">Evento</th>
                      <th className="px-6 py-3">Ref. Contrato</th>
                      <th className="px-6 py-3">Detalle</th>
                      <th className="px-6 py-3">Docs</th>
                      <th className="px-6 py-3">Estado</th>
                      <th className="px-6 py-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <TableRow 
                      date="20 Oct, 14:30" type="Radicación contractual" contract="CT-892" material="Minuta y anexos" 
                      qty="12 docs" status="Validado" statusType="success" to="/operative/collection"
                    />
                    <TableRow 
                      date="20 Oct, 09:15" type="Revisión jurídica" contract="CT-892" material="Póliza de cumplimiento" 
                      qty="4 docs" status="Validado" statusType="success" to="/operative/eca-classification"
                    />
                     <TableRow 
                      date="19 Oct, 16:45" type="Subsanación" contract="CT-892" material="CDP faltante" 
                      qty="1 soporte" status="Devuelto" statusType="error" to="/operative/deliverables"
                    />
                    <TableRow 
                      date="18 Oct, 10:00" type="Control documental" contract="General" material="Seguridad Social" 
                      qty="2 docs" status="Pendiente" statusType="warning" to="/operative/processes"
                    />
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* 6. Panel de Alertas Normativas (Lateral Refinado) */}
          <aside className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm h-full flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-red-50 bg-red-50/20 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-xs uppercase tracking-wide">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                  Alertas Normativas
                </h3>
                <span className="text-[10px] font-bold bg-white border border-red-100 text-red-600 px-2 py-0.5 rounded-full shadow-sm">
                  3 Activas
                </span>
              </div>
              
              <div className="p-4 space-y-3 flex-1 bg-gradient-to-b from-red-50/10 to-transparent">
                <AlertItem 
                  title="Póliza próxima a vencer" 
                  desc="Vigencia termina en 3 días. Bloquea aprobación."
                  severity="critical"
                />
                <AlertItem 
                  title="Documento ARL Vencido" 
                  desc="Renovación requerida para operación."
                  severity="critical"
                />
                <AlertItem 
                  title="Soporte presupuestal faltante" 
                  desc="El RP no coincide con el valor del hito."
                  severity="warning"
                />
                <AlertItem 
                  title="Expediente SECOP incompleto" 
                  desc="Faltan anexos obligatorios."
                  severity="warning"
                />
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
                  El sistema bloquea aprobaciones si existen soportes contractuales vencidos o incompletos.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full text-xs h-8 bg-white hover:bg-slate-50 text-slate-600 border-slate-200">
                  <Link to="/operative/mass-balance">Gestión de Cumplimiento</Link>
                </Button>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-components (SaaS Style)
// ----------------------------------------------------------------------

interface StatusCardProps { title: string; value: string; trend: string; status: 'success' | 'warning' | 'danger' | 'neutral'; icon: React.ReactNode; highlight?: boolean; }
function StatusCard({ title, value, trend, status, icon, highlight }: StatusCardProps) {
  const statusColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    neutral: 'bg-slate-400'
  };

  const statusTextColors = {
    success: 'text-emerald-700',
    warning: 'text-amber-700',
    danger: 'text-red-700',
    neutral: 'text-slate-600'
  };

  return (
    <div className={`relative p-5 rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${highlight ? 'border-amber-200 ring-1 ring-amber-50' : 'border-slate-100'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
          {icon}
        </div>
        <div className={`h-2 w-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`} />
      </div>
      <div>
        <h4 className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">{title}</h4>
        <div className={`text-lg font-bold ${statusTextColors[status as keyof typeof statusTextColors]}`}>{value}</div>
        <p className="text-[10px] text-slate-400 mt-1 font-medium">{trend}</p>
      </div>
    </div>
  );
}

interface MiniStatusCardProps { label: string; value: string; icon: React.ReactNode; color: 'amber' | 'blue' | 'slate'; }
function MiniStatusCard({ label, value, icon, color }: MiniStatusCardProps) {
    const colors = {
        amber: 'text-amber-600 bg-amber-50',
        blue: 'text-blue-600 bg-blue-50',
        slate: 'text-slate-600 bg-slate-100',
    };
    
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
            <div className={`p-1.5 rounded-md ${colors[color as keyof typeof colors]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
                <p className="text-xs font-bold text-slate-700">{value}</p>
            </div>
        </div>
    )
}

interface ActionButtonProps { icon: React.ReactElement; label: string; desc: string; variant: 'active' | 'normal' | 'critical'; href?: string; }
function ActionButton({ icon, label, desc, variant, href }: ActionButtonProps) {
  const styles = {
    active: 'bg-blue-50/50 border-blue-200 text-[#002B5B] shadow-sm ring-1 ring-blue-100 hover:shadow-md',
    normal: 'bg-white border-slate-100 text-slate-600 shadow-sm hover:border-slate-300 hover:shadow hover:text-[#002B5B]',
    critical: 'bg-white border-amber-100 text-slate-700 hover:border-amber-200 hover:shadow-sm ring-1 ring-transparent hover:ring-amber-50'
  };

  const content = (
    <div className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 text-center h-32 w-full group ${styles[variant]}`}>
       <div className={`mb-3 p-2 rounded-lg transition-transform group-hover:scale-110 group-hover:-translate-y-1 ${
           variant === 'active' ? 'bg-white text-[#002B5B] shadow-sm' :
           'bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-[#002B5B] group-hover:shadow-sm'
       }`}>
          {React.cloneElement(icon, { size: 20, strokeWidth: 1.5 })}
       </div>
       <span className="text-xs font-bold leading-tight px-1 mb-1">{label}</span>
       <span className="text-[10px] font-medium opacity-70 leading-none">{desc}</span>
       {variant === 'active' && <span className="mt-2 h-1 w-8 bg-blue-500 rounded-full opacity-50"></span>}
    </div>
  );

  if (href) {
    return <Link to={href} className="w-full">{content}</Link>;
  }

  return <button className="w-full">{content}</button>;
}

interface SecondaryActionButtonProps { icon: React.ReactElement; label: string; highlight?: boolean; to?: string; onClick?: () => void; }
function SecondaryActionButton({ icon, label, highlight, to, onClick }: SecondaryActionButtonProps) {
    const content = (
        <div className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all text-center h-20 w-full hover:shadow-sm ${
            highlight ? 'bg-red-50/50 border-red-100 text-red-700 hover:bg-red-50' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-700'
        }`}>
            <div className="mb-1">
                {React.cloneElement(icon, { size: 18, strokeWidth: 1.5 })}
            </div>
            <span className="text-[10px] font-semibold">{label}</span>
        </div>
    );

    if (to) {
        return <Link to={to}>{content}</Link>;
    }

    return (
        <button type="button" onClick={onClick} className="w-full">
            {content}
        </button>
    )
}

interface FlowStepProps { step: string; label: string; status: 'completed' | 'active' | 'pending' | 'locked'; icon: React.ReactElement; }
function FlowStep({ step, label, status, icon }: FlowStepProps) {
  const styles = {
    completed: { circle: 'border-emerald-500 bg-emerald-500 text-white', text: 'text-emerald-700' },
    active: { circle: 'border-[#002B5B] bg-white text-[#002B5B] shadow-[0_0_0_4px_rgba(0,43,91,0.1)]', text: 'text-[#002B5B]' },
    pending: { circle: 'border-slate-200 bg-white text-slate-300', text: 'text-slate-400' },
    locked: { circle: 'border-slate-100 bg-slate-50 text-slate-300', text: 'text-slate-300' },
  };

  const current = styles[status as keyof typeof styles];

  return (
    <div className="relative z-10 flex flex-col items-center gap-3 min-w-[80px] flex-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all font-bold text-xs ${current.circle}`}>
        {status === 'completed' ? <CheckCircle className="h-5 w-5" /> : React.cloneElement(icon, { className: "h-4 w-4" })}
      </div>
      <div className="text-center flex flex-col items-center">
        <span className={`text-[10px] uppercase tracking-wider font-bold ${current.text}`}>{label}</span>
        <span className="text-[9px] text-slate-400 font-mono mt-0.5">{step}</span>
      </div>
    </div>
  );
}

interface TableRowProps { date: string; type: string; contract: string; material: string; qty: string; status: string; statusType: 'success' | 'error' | 'warning'; to: string; }
function TableRow({ date, type, contract, material, qty, status, statusType, to }: TableRowProps) {
  const statusStyles = {
      success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      error: 'bg-red-50 text-red-700 border-red-100',
      warning: 'bg-amber-50 text-amber-800 border-amber-100'
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group">
      <td className="px-6 py-3 text-slate-500 text-xs font-mono">{date}</td>
      <td className="px-6 py-3 font-semibold text-slate-700">{type}</td>
      <td className="px-6 py-3 text-slate-500 text-xs">{contract}</td>
      <td className="px-6 py-3 text-slate-600">{material}</td>
      <td className="px-6 py-3 text-slate-600 font-mono">{qty}</td>
      <td className="px-6 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${statusStyles[statusType as keyof typeof statusStyles]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-3 text-right">
        <Link to={to} className="inline-flex text-slate-300 hover:text-[#002B5B]">
            <MoreHorizontal className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
}

interface AlertItemProps { title: string; desc: string; severity: 'critical' | 'warning'; }
function AlertItem({ title, desc, severity }: AlertItemProps) {
  const isCritical = severity === 'critical';
  return (
    <div className={`p-3 rounded-lg border-l-4 transition-all hover:bg-white hover:shadow-sm ${isCritical ? 'bg-red-50/40 border-l-red-500 border-y border-r border-red-50/50' : 'bg-amber-50/40 border-l-amber-400 border-y border-r border-amber-50/50'}`}>
      <div className="flex justify-between items-start">
        <h4 className={`text-xs font-bold mb-1 ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>{title}</h4>
        {isCritical && <Ban className="h-3 w-3 text-red-400" />}
      </div>
      <p className="text-[11px] text-slate-600 leading-snug opacity-90">{desc}</p>
    </div>
  );
}
