import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User } from '../types';
import { storage } from '../utils/storage';
import { authService } from '../services/api.service';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export function AuthDialog({ open, onClose, onLogin }: AuthDialogProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): { valid: boolean; message: string } => {
    if (password.length < 12) {
      return { valid: false, message: 'La contraseña debe tener al menos 12 caracteres' };
    }
    if (!/[a-zA-Z]/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos una letra' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos un número' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos un símbolo (!@#$%^&*...)' };
    }
    return { valid: true, message: '' };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar contraseña
    const passwordValidation = validatePassword(loginPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        email: loginEmail,
        password: loginPassword,
      });

      // Guardar token y usuario
      storage.setToken(response.token);
      const userWithToken: User = {
        ...response.user,
        token: response.token,
      };
      storage.setCurrentUser(userWithToken);

      onLogin(userWithToken);
      toast.success(`¡Bienvenido ${response.user.name}!`);
      onClose();

      // Limpiar formulario
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar contraseña
    const passwordValidation = validatePassword(registerPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: 'customer',
      });

      // Guardar token y usuario
      storage.setToken(response.token);
      const userWithToken: User = {
        ...response.user,
        token: response.token,
      };
      storage.setCurrentUser(userWithToken);

      onLogin(userWithToken);
      toast.success(`¡Cuenta creada! Bienvenido ${response.user.name}`);
      onClose();

      // Limpiar formulario
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Error al crear la cuenta. El email podría estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setLoading(true);

    try {
      // Intentar login real con el backend
      console.log('🔐 Intentando login de admin con el backend...');
      console.log('📧 Email:', 'admin@ecoliving.com');
      console.log('🔑 Password:', 'AdminEco2024!');

      const response = await authService.login({
        email: 'admin@ecoliving.com',
        password: 'AdminEco2024!',
      });

      console.log('✅ Login exitoso! Respuesta del backend:', response);
      console.log('👤 Usuario:', response.user);
      console.log('🎫 Token:', response.token);

      // Si el login es exitoso, usar el token real
      storage.setToken(response.token);
      const userWithToken: User = {
        ...response.user,
        token: response.token,
      };
      storage.setCurrentUser(userWithToken);

      console.log('💾 Usuario guardado en storage:', userWithToken);

      onLogin(userWithToken);
      toast.success(`¡Bienvenido ${response.user.name}! Login exitoso con el backend.`);
      onClose();
    } catch (error) {
      console.error('❌ Error en login de admin:', error);
      console.error('📋 Detalles del error:', JSON.stringify(error, null, 2));

      // Si falla, crear usuario admin ficticio para desarrollo
      const adminUser: User = {
        id: 999999,
        name: 'Administrador ECOLIVING (Demo)',
        email: 'admin@ecoliving.com',
        role: 'admin',
        token: 'demo-admin-token-' + Date.now(),
      };

      // Guardar en storage
      storage.setToken(adminUser.token);
      storage.setCurrentUser(adminUser);

      console.log('🎭 Usando modo demo. Usuario:', adminUser);

      // Notificar al componente padre
      onLogin(adminUser);
      toast.warning('Modo demo activado. El backend no respondió correctamente.');
      onClose();
    } finally {
      setLoading(false);
      console.log('🏁 handleAdminLogin finalizado');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Acceder a tu cuenta</DialogTitle>
          <DialogDescription>
            Inicia sesión o crea una cuenta para continuar
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              {/* Botón de acceso admin directo */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    O
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                onClick={handleAdminLogin}
              >
                🔑 Acceso Admin (Demo)
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nombre</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Tu nombre"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                  title="Solo letras y espacios (incluyendo ñ y tildes)"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={12}
                    title="Mínimo 12 caracteres, debe incluir letra, número y símbolo"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mínimo 12 caracteres, debe incluir letra, número y símbolo
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
