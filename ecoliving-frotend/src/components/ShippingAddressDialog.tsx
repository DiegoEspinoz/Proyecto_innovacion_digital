import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ShippingAddress } from '../types';

interface ShippingAddressDialogProps {
  open: boolean;
  onClose: () => void;
  defaultName: string;
  onConfirm: (address: ShippingAddress) => void;
}

export function ShippingAddressDialog({
  open,
  onClose,
  defaultName,
  onConfirm
}: ShippingAddressDialogProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    name: defaultName,
    street: '',
    avenue: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(address);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Dirección de Envío
          </DialogTitle>
          <DialogDescription>
            Por favor ingresa la dirección donde deseas recibir tu pedido
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              placeholder="Nombre de quien recibe"
              pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
              title="Solo letras y espacios (incluyendo ñ y tildes)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Calle *</Label>
            <Input
              id="street"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="Ej: Calle Principal 123"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avenue">Distrito (opcional)</Label>
            <Input
              id="avenue"
              value={address.avenue}
              onChange={(e) => setAddress({ ...address, avenue: e.target.value })}
              placeholder="Ej: Miraflores"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="Tu ciudad"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Código Postal *</Label>
              <Input
                id="postalCode"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                placeholder="12345"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono de contacto *</Label>
            <Input
              id="phone"
              type="tel"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p className="text-blue-900">
              📦 Tu pedido será enviado a esta dirección. Asegúrate de que todos los datos
              sean correctos.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Continuar con el Pago
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
