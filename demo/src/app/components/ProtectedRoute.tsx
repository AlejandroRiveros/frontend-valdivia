import { Navigate, Outlet } from 'react-router';

// Tipos de roles soportados
type AllowedRoles = 'ADMIN' | 'DIRECTOR' | 'ANALYST' | 'OPERATOR';

interface ProtectedRouteProps {
  allowedRoles: AllowedRoles[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('valdivia_token');
  const userStr = localStorage.getItem('valdivia_user');
  
  if (!token || !userStr) {
    // Si no está autenticado, lo mandamos al login local
    return <Navigate to="/" replace />;
  }

  let user: { role: AllowedRoles } | null = null;
  try {
    user = JSON.parse(userStr);
  } catch {
    return <Navigate to="/" replace />;
  }
  if (!user) return <Navigate to="/" replace />;
  const userRole = user.role as AllowedRoles;

  // Un Admin tiene super-permisos, por lo tanto siempre tiene paso
  // Si no es admin, chequeamos si su rol específico está en el array permitido para esta vista
  if (userRole !== 'ADMIN' && !allowedRoles.includes(userRole)) {
    // Intenta acceder a algo prohibido. Redirigir a un dashboard seguro que conozcamos
    if (userRole === 'DIRECTOR') return <Navigate to="/director/dashboard" replace />;
    return <Navigate to="/operative/dashboard" replace />;
  }

  // Si tiene permisos, rinde los hijos de esta ruta
  return <Outlet />;
}
