import React, { useState, useEffect } from 'react';
import { Users, UserPlus, FileEdit, Trash2, Mail, AtSign, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import DirectorHeader from '../components/director/DirectorHeader';
import { apiFetch } from '../../lib/api';

function generateEmailBase(nombres: string, apellidos: string): string {
  const normalize = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');

  const nameParts = nombres.trim().split(/\s+/);
  const lastNameParts = apellidos.trim().split(/\s+/);

  const first = normalize(nameParts[0] ?? '');
  const secondInitial = nameParts[1] ? (normalize(nameParts[1])[0] ?? '') : '';
  const lastName = normalize(lastNameParts[0] ?? '');

  if (!first || !lastName) return '';

  const username = secondInitial
    ? `${first}.${secondInitial}.${lastName}`
    : `${first}.${lastName}`;

  return `${username}@valdivia.gov.co`;
}

const EMPTY_FORM = { nombres: '', apellidos: '', password: '', role: 'ANALYST' };

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const emailPreview = generateEmailBase(formData.nombres, formData.apellidos);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/users');
      if (res.ok) setUsers(await res.json());
    } catch { /* silent */ } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailPreview) return;
    setIsSubmitting(true);
    setFormError('');
    setFormSuccess('');

    const fullName = `${formData.nombres.trim()} ${formData.apellidos.trim()}`;
    const [localPart] = emailPreview.split('@');

    for (let attempt = 1; attempt <= 5; attempt++) {
      const email = attempt === 1
        ? emailPreview
        : `${localPart}${attempt}@valdivia.gov.co`;

      const res = await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({ name: fullName, email, password: formData.password, role: formData.role })
      });

      if (res.ok) {
        setFormSuccess(`Usuario creado con correo: ${email}`);
        setFormData(EMPTY_FORM);
        setShowForm(false);
        fetchUsers();
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      if (res.status !== 409) {
        setFormError(data.error || 'Error al crear usuario');
        setIsSubmitting(false);
        return;
      }
    }

    setFormError('No se pudo generar un correo único. Intente con un nombre diferente.');
    setIsSubmitting(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await apiFetch(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !currentStatus })
      });
      fetchUsers();
    } catch { /* silent */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar a este usuario de toda la plataforma?')) return;
    try {
      const res = await apiFetch(`/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch { /* silent */ }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <DirectorHeader
        title="Panel de Administración"
        subtitle="Control general de la plataforma y usuarios"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header de sección */}
        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-lg border shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#002B5B]" />
              Gestión de Usuarios
            </h2>
            <p className="text-sm text-slate-500 mt-1">Control de acceso y creación de roles para la plataforma.</p>
          </div>
          <Button
            onClick={() => { setShowForm(!showForm); setFormError(''); setFormSuccess(''); }}
            className="bg-[#002B5B] text-white hover:bg-[#001F44]"
          >
            {showForm ? 'Cancelar Creación' : <><UserPlus className="h-4 w-4 mr-2" />Nuevo Usuario</>}
          </Button>
        </div>

        {/* Feedback de éxito fuera del form */}
        {formSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm font-medium">
            <CheckCircle className="h-5 w-5 shrink-0" />
            {formSuccess}
          </div>
        )}

        {/* Formulario de Creación */}
        {showForm && (
          <div className="bg-white rounded-lg border shadow-sm p-6 mb-6 animate-in slide-in-from-top-4 duration-300">
            <h3 className="font-bold text-slate-800 mb-5 border-b pb-3">Registrar Nuevo Colaborador</h3>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Fila 1: Nombres y Apellidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre(s) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={formData.nombres}
                    onChange={e => setFormData({ ...formData, nombres: e.target.value })}
                    className="w-full text-sm py-2 px-3 border border-slate-300 rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B]"
                    placeholder="Ej: Ana María"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={formData.apellidos}
                    onChange={e => setFormData({ ...formData, apellidos: e.target.value })}
                    className="w-full text-sm py-2 px-3 border border-slate-300 rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B]"
                    placeholder="Ej: González Ruiz"
                  />
                </div>
              </div>

              {/* Correo generado (preview) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Correo institucional <span className="text-slate-400 font-normal">(generado automáticamente)</span>
                </label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-mono ${
                  emailPreview ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-50 border-dashed border-slate-200 text-slate-400'
                }`}>
                  <AtSign className="h-4 w-4 shrink-0 text-slate-400" />
                  {emailPreview || 'Se generará al ingresar nombre y apellidos'}
                </div>
              </div>

              {/* Fila 2: Contraseña y Rol */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contraseña inicial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full text-sm py-2 px-3 border border-slate-300 rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B]"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rol en sistema</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full text-sm py-2 px-3 border border-slate-300 rounded-lg focus:ring-[#002B5B] focus:border-[#002B5B]"
                  >
                    <option value="ANALYST">Analista (Operativo)</option>
                    <option value="OPERATOR">Operador</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="JURIDIC">Jurídico</option>
                    <option value="DIRECTOR">Director Estratégico</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                  {formError}
                </div>
              )}

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  disabled={isSubmitting || !emailPreview}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registrando...
                    </span>
                  ) : 'Registrar en Sistema'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Usuario</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Permisos (Rol)</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center">Estado</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center py-10 text-slate-400">Cargando usuarios...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-slate-400">No hay usuarios registrados.</td></tr>
                ) : users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-[#002B5B]">{user.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'DIRECTOR' ? 'bg-blue-100 text-blue-700' :
                          user.role === 'JURIDIC' ? 'bg-amber-100 text-amber-700' :
                          user.role === 'SUPERVISOR' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-slate-100 text-slate-700'}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        title="Clic para activar/desactivar"
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors shadow-sm
                          ${user.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                          }`}
                      >
                        {user.isActive ? 'Cuenta Activa' : 'Desactivado'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 text-slate-400">
                        <button className="p-2 hover:bg-slate-100 rounded hover:text-[#002B5B] transition-colors" title="Editar Rol">
                          <FileEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-red-50 rounded hover:text-red-600 transition-colors"
                          title="Eliminar del Sistema"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
