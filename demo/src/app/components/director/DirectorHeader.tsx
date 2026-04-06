import { Bell, ChevronLeft, LogOut } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import valdiviaLogo from '../../../assets/9ea87c1c8d8e49e210fe4afd0e12a9f44fe0b8ee.png';

interface DirectorHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  rightContent?: ReactNode;
  backTo?: string;
  maxWidthClassName?: string;
  heightClassName?: string;
}

const navItems = [
  { label: 'Dashboard', to: '/director/dashboard', match: '/director/dashboard' },
  { label: 'Autorizaciones', to: '/director/authorization?status=all', match: '/director/authorization' },
  { label: 'Contratos', to: '/director/contract-file?contractId=CT-2023-089', match: '/director/contract-file' },
  { label: 'Procesos', to: '/director/new-process', match: '/director/new-process' },
];

export default function DirectorHeader({
  title,
  subtitle,
  rightContent,
  backTo,
  maxWidthClassName = 'max-w-7xl',
  heightClassName = 'h-20',
}: DirectorHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener datos del usuario logueado
  const userStr = localStorage.getItem('valdivia_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || 'Cargando...';
  const userRole = user?.role === 'ADMIN' ? 'Administrador' : user?.role === 'DIRECTOR' ? 'Director' : 'Analista';
  const userAvatar = user?.avatar || 'US';

  const handleLogout = () => {
    localStorage.removeItem('valdivia_token');
    localStorage.removeItem('valdivia_user');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className={`mx-auto flex ${heightClassName} items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 ${maxWidthClassName}`}>
        <div className="flex min-w-0 items-center gap-4">
          {backTo ? (
            <Link to={backTo} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-[#002B5B]">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          ) : null}

          <div className="flex items-center gap-3">
            <img src={valdiviaLogo} alt="Logo VALDIVIA" className="h-12 w-auto object-contain md:h-16" />
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none tracking-tight text-[#002B5B]">VALDIVIA</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {user?.role === 'ADMIN' ? 'Panel de Control' : user?.role === 'DIRECTOR' ? 'Panel Directivo' : 'Panel Operativo'}
              </span>
            </div>
          </div>

          <div className="hidden h-8 w-px bg-slate-200 md:block" />

          {title ? (
            <div className="hidden min-w-0 md:block">
              <div className="truncate text-lg font-bold leading-none text-[#002B5B]">{title}</div>
              {subtitle ? <p className="mt-1 truncate text-sm text-slate-500">{subtitle}</p> : null}
            </div>
          ) : (
            <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
              {navItems.map((item) => {
                const active = location.pathname.startsWith(item.match);
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={active ? 'font-semibold text-[#002B5B]' : 'transition-colors hover:text-[#002B5B]'}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {rightContent}
          {user?.role === 'DIRECTOR' && (
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 lg:flex">
              <span className="text-xs font-semibold text-slate-600">Estado mes:</span>
              <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-xs font-medium text-emerald-700">Optimo</span>
            </div>
          )}
          <button className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-50">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />
          </button>
          <div className="flex items-center gap-3 border-l border-slate-100 pl-2">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">{userRole}</p>
            </div>
            <button
              onClick={handleLogout}
              className="hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 md:flex"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-bold text-[#002B5B] shadow-sm">
              {userAvatar}
            </div>
          </div>
        </div>
      </div>

      {title ? (
        <div className="border-t border-slate-100 px-4 py-2 md:hidden">
          <div className="text-sm font-bold text-[#002B5B]">{title}</div>
          {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      ) : null}
    </header>
  );
}
