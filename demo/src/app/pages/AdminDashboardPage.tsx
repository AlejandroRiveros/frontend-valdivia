import React, { useState, useEffect } from 'react';
import { Users, UserPlus, FileEdit, Trash2, ShieldCheck, Mail, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import DirectorHeader from '../components/director/DirectorHeader';

// Nota: Normalmente estas rutas van a variables de entorno, acá lo hardcodeamos para MVP
const API_URL = 'http://localhost:3000/api';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States para el formulario
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'ANALYST', password: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`);
      if (res.ok) {
         const data = await res.json();
         setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Usuario Creado Exitosamente');
        setFormData({ name: '', email: '', role: 'ANALYST', password: '' });
        setShowForm(false);
        fetchUsers();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (e) {
      alert('Fallo de red al crear usuario.');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`${API_URL}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      fetchUsers();
    } catch (e) {
      console.error("Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar a este usuario de toda la plataforma?')) return;
    
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
         fetchUsers();
      } else {
         const error = await res.json();
         alert(error.error);
      }
    } catch (e) {
      console.error("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      <DirectorHeader 
        title="Panel de Administración" 
        subtitle="Control general de la plataforma y usuarios" 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg border shadow-sm">
            <div>
               <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#002B5B]" />
                  Gestión de Usuarios
               </h2>
               <p className="text-sm text-slate-500 mt-1">Control de acceso y creación de roles para la plataforma.</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="bg-[#002B5B] text-white hover:bg-[#001F44]">
               {showForm ? 'Cancelar Creación' : <><UserPlus className="h-4 w-4 mr-2" /> Nuevo Usuario</>}
            </Button>
         </div>

         {/* Formulario de Creación */}
         {showForm && (
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-8 animate-in slide-in-from-top-4 duration-300">
               <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Crear Nuevo Colaborador</h3>
               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
                     <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full text-sm py-2 px-3 border rounded focus:ring-[#002B5B] focus:border-[#002B5B]" placeholder="Ej: Juan Perez" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-1">Correo (Login)</label>
                     <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full text-sm py-2 px-3 border rounded focus:ring-[#002B5B] focus:border-[#002B5B]" placeholder="usuario@gov.co" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-1">Clave de Acceso</label>
                     <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full text-sm py-2 px-3 border rounded focus:ring-[#002B5B] focus:border-[#002B5B]" placeholder="••••••••" />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-1">Rol en Sistema</label>
                     <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full text-sm py-2 px-3 border rounded focus:ring-[#002B5B] focus:border-[#002B5B]">
                        <option value="ANALYST">Analista (Operativo)</option>
                        <option value="DIRECTOR">Director Estratégico</option>
                        <option value="ADMIN">Administrador VIP</option>
                     </select>
                  </div>
                  <div className="lg:col-span-4 mt-2 flex justify-end">
                     <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                        Registrar en Sistema
                     </Button>
                  </div>
               </form>
            </div>
         )}

         {/* Lista de Usuarios */}
         <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b">
                     <tr>
                        <th className="px-6 py-4 font-bold tracking-wider">Usuario</th>
                        <th className="px-6 py-4 font-bold tracking-wider">Permisos (Rol)</th>
                        <th className="px-6 py-4 font-bold tracking-wider text-center">Estado</th>
                        <th className="px-6 py-4 font-bold tracking-wider text-right">Acciones Administrativas</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {isLoading ? (
                        <tr><td colSpan={4} className="text-center py-8 text-slate-500">Cargando base de datos...</td></tr>
                     ) : users.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                    {user.avatar}
                                 </div>
                                 <div>
                                    <p className="font-bold text-[#002B5B]">{user.name}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="h-3 w-3" /> {user.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                 ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                                   user.role === 'DIRECTOR' ? 'bg-blue-100 text-blue-700' : 
                                   'bg-slate-100 text-slate-700'}`
                              }>
                                 {user.role}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-center">
                              <button 
                                 onClick={() => handleToggleStatus(user.id, user.isActive)}
                                 className={`px-3 py-1 rounded-full text-xs font-bold transition-colors shadow-sm
                                 ${user.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200' : 
                                 'bg-red-50 text-red-700 border border-red-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'}`}
                                 title="Clic para cambiar el estado (Activar/Desactivar)"
                              >
                                 {user.isActive ? 'Cuenta Activa' : 'Desactivado'}
                              </button>
                           </td>
                           <td className="px-6 py-4 text-right flex justify-end gap-2 text-slate-400">
                              <button className="p-2 hover:bg-slate-100 rounded hover:text-[#002B5B] transition-colors" title="Editar Rol">
                                 <FileEdit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-50 rounded hover:text-red-600 transition-colors" title="Eliminar del Sistema">
                                 <Trash2 className="h-4 w-4" />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </main>
    </div>
  );
}
