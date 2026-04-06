import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router';
import valdiviaLogo from '../../assets/9ea87c1c8d8e49e210fe4afd0e12a9f44fe0b8ee.png';

const API_URL = 'http://localhost:3000/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    if (!isEmailValid) {
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('valdivia_token', data.token);
        localStorage.setItem('valdivia_user', JSON.stringify(data.user));

        if (data.user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (data.user.role === 'DIRECTOR') {
          navigate('/director/dashboard');
        } else {
          navigate('/operative/dashboard');
        }
      } else {
        setError(data.error || 'Credenciales invalidas. Intente nuevamente.');
      }
    } catch (err) {
      setError('Error de conexion con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      <div className="fixed inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[420px] bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden relative z-10"
      >
        <div className="p-8 md:p-10 space-y-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full flex justify-center">
              <img
                src={valdiviaLogo}
                alt="Logo VALDIVIA"
                className="h-32 w-auto object-contain"
              />
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Iniciar sesion
              </h1>
              <p className="text-sm text-slate-500">
                Acceso a la plataforma de gestion contractual
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Correo electronico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@institucion.gov.co"
                    className={`pl-10 bg-slate-50/50 focus:border-[#002B5B] focus:ring-[#002B5B] ${
                      emailTouched && !isEmailValid ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    required
                  />
                </div>
                {emailTouched && !isEmailValid && (
                  <p className="text-xs text-red-500">Ingresa un correo valido con formato `usuario@dominio.com`.</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    className="pl-10 pr-10 bg-slate-50/50 border-slate-200 focus:border-[#002B5B] focus:ring-[#002B5B]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                className="w-full bg-[#002B5B] hover:bg-[#001F44] text-white font-medium h-12 text-base shadow-md transition-all duration-200 active:scale-[0.99]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verificando credenciales...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Ingresar al sistema
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
          <div className="flex flex-col items-center justify-center space-y-2 text-slate-500">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-slate-400">
              <ShieldCheck className="h-3 w-3" />
              <span>Seguridad Institucional</span>
            </div>
            <p className="text-xs">
              Acceso auditado y protegido. Control por roles.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 text-center space-y-2 relative z-10">
        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          Plataforma VALDIVIA {new Date().getFullYear()}
          <br />
          Sistema de Gestion Contractual y Licitaciones
        </p>
      </div>
    </div>
  );
}
