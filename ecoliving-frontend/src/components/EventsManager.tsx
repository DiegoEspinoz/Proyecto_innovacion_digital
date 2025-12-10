import { useState, useEffect } from 'react';
import { Sun, Snowflake, Flag, Ghost, TreePine, Sparkles, Percent, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { Product, Event } from '../types';

interface EventsManagerProps {
  products: Product[];
}

const eventTemplates = [
  {
    id: 'summer',
    name: 'Verano',
    icon: Sun,
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    defaultDiscount: 15
  },
  {
    id: 'winter',
    name: 'Invierno',
    icon: Snowflake,
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    defaultDiscount: 20
  },
  {
    id: 'patriotic',
    name: 'Fiestas Patrias',
    icon: Flag,
    color: 'bg-red-100 border-red-300 text-red-800',
    defaultDiscount: 25
  },
  {
    id: 'halloween',
    name: 'Halloween',
    icon: Ghost,
    color: 'bg-orange-100 border-orange-300 text-orange-800',
    defaultDiscount: 18
  },
  {
    id: 'christmas',
    name: 'Navidad',
    icon: TreePine,
    color: 'bg-green-100 border-green-300 text-green-800',
    defaultDiscount: 30
  }
];

export function EventsManager({ products }: EventsManagerProps) {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [selectedEventTemplate, setSelectedEventTemplate] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(15);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Cargar evento activo del localStorage
    const savedEvent = localStorage.getItem('activeEvent');
    if (savedEvent) {
      setActiveEvent(JSON.parse(savedEvent));
    }
  }, []);

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleActivateEvent = () => {
    if (!selectedEventTemplate) {
      toast.error('Selecciona un evento');
      return;
    }

    if (selectedProducts.size === 0) {
      toast.error('Selecciona al menos un producto');
      return;
    }

    const template = eventTemplates.find(e => e.id === selectedEventTemplate);
    if (!template) return;

    const newEvent: Event = {
      id: selectedEventTemplate,
      name: template.name,
      discountPercentage,
      productIds: Array.from(selectedProducts),
      isActive: true,
      color: template.color,
      icon: template.icon.name
    };

    setActiveEvent(newEvent);
    localStorage.setItem('activeEvent', JSON.stringify(newEvent));
    
    toast.success(`¡Evento "${template.name}" activado!`, {
      description: `${discountPercentage}% de descuento en ${selectedProducts.size} productos`
    });
  };

  const handleDeactivateEvent = () => {
    setActiveEvent(null);
    localStorage.removeItem('activeEvent');
    setSelectedEventTemplate(null);
    setSelectedProducts(new Set());
    setDiscountPercentage(15);
    toast.info('Evento desactivado');
  };

  const handleSelectEventTemplate = (templateId: string) => {
    setSelectedEventTemplate(templateId);
    const template = eventTemplates.find(e => e.id === templateId);
    if (template) {
      setDiscountPercentage(template.defaultDiscount);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2">Gestión de Eventos</h3>
        <p className="text-sm text-muted-foreground">
          Crea eventos especiales con descuentos en productos seleccionados
        </p>
      </div>

      {/* Evento Activo */}
      {activeEvent && (
        <Card className={`border-2 ${eventTemplates.find(e => e.id === activeEvent.id)?.color}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <CardTitle>Evento Activo: {activeEvent.name}</CardTitle>
              </div>
              <Button variant="destructive" size="sm" onClick={handleDeactivateEvent}>
                Desactivar
              </Button>
            </div>
            <CardDescription>
              {activeEvent.discountPercentage}% de descuento en {activeEvent.productIds.length} productos
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Selección de Evento */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Evento</CardTitle>
          <CardDescription>Elige el tipo de evento que deseas activar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {eventTemplates.map((template) => {
              const Icon = template.icon;
              const isSelected = selectedEventTemplate === template.id;
              
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectEventTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? template.color + ' shadow-md scale-105' 
                      : 'bg-white hover:bg-muted/50 border-muted'
                  }`}
                  disabled={activeEvent !== null}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm text-center">{template.name}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Descuento */}
      {selectedEventTemplate && !activeEvent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5" />
              Configurar Descuento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Porcentaje de Descuento</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max="90"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(Math.min(90, Math.max(1, parseInt(e.target.value) || 0)))}
                  className="w-24"
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selección de Productos */}
      {selectedEventTemplate && !activeEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Productos</CardTitle>
            <CardDescription>
              Marca los productos que tendrán descuento ({selectedProducts.size} seleccionados)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    selectedProducts.has(product.id) 
                      ? 'bg-green-50 border-green-200' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <Checkbox
                    id={`product-${product.id}`}
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={() => handleSelectProduct(product.id)}
                  />
                  <label
                    htmlFor={`product-${product.id}`}
                    className="flex-1 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm line-through text-muted-foreground">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-600">
                        ${(product.price * (1 - discountPercentage / 100)).toFixed(2)}
                      </p>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedEventTemplate(null);
                  setSelectedProducts(new Set());
                }}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleActivateEvent}
                disabled={selectedProducts.size === 0}
              >
                <Check className="w-4 h-4 mr-2" />
                Activar Evento
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
