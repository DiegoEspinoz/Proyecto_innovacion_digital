import { useState, useEffect } from 'react';
import { Moon, Sun, Cookie, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { UserSettings } from '../types';
import { storage } from '../utils/storage';

interface SettingsPageProps {
  userId: number;
}

export function SettingsPage({ userId }: SettingsPageProps) {
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    cookiesAccepted: true,
    notifications: true
  });

  useEffect(() => {
    // Cargar configuración del storage
    const savedSettings = storage.getUserSettings(userId);
    setSettings(savedSettings);
  }, [userId]);

  const handleSettingChange = (key: keyof UserSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.saveUserSettings(userId, newSettings);

    if (key === 'darkMode') {
      // Aplicar o remover clase dark en el document
      if (value) {
        document.documentElement.classList.add('dark');
        toast.success('Modo oscuro activado');
      } else {
        document.documentElement.classList.remove('dark');
        toast.success('Modo claro activado');
      }
    } else {
      toast.success('Configuración actualizada');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2>Configuración</h2>
        <p className="text-muted-foreground">Personaliza tu experiencia en ECOLIVING</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Apariencia
          </CardTitle>
          <CardDescription>Ajusta cómo se ve la aplicación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <Label htmlFor="dark-mode">Modo Oscuro</Label>
                <p className="text-sm text-muted-foreground">
                  Activa el tema oscuro para reducir el brillo
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="w-5 h-5" />
            Privacidad
          </CardTitle>
          <CardDescription>Controla tus preferencias de privacidad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cookie className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="cookies">Cookies y Almacenamiento Local</Label>
                <p className="text-sm text-muted-foreground">
                  Permitir que la app guarde datos en tu navegador
                </p>
              </div>
            </div>
            <Switch
              id="cookies"
              checked={settings.cookiesAccepted}
              onCheckedChange={(checked) => handleSettingChange('cookiesAccepted', checked)}
            />
          </div>

          <div className="p-4 bg-muted/50 rounded-lg text-sm">
            <p className="text-muted-foreground">
              Esta aplicación utiliza localStorage para guardar tu carrito de compras,
              historial de pedidos y preferencias. Los datos se almacenan únicamente en
              tu dispositivo y no se comparten con terceros.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificaciones
          </CardTitle>
          <CardDescription>Gestiona tus preferencias de notificaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label htmlFor="notifications">Notificaciones de Pedidos</Label>
                <p className="text-sm text-muted-foreground">
                  Recibe alertas sobre el estado de tus pedidos
                </p>
              </div>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
