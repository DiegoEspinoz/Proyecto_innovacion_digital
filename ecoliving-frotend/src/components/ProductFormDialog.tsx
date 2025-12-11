import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { productService } from '../services/api.service';
import { toast } from 'sonner';
import { Product } from '../types';

interface ProductFormDialogProps {
    open: boolean;
    onClose: () => void;
    onProductCreated: () => void;
}

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
    ecoFeatures: string;
}

const CATEGORIES = ['Vegetales', 'Frutas', 'Lácteos', 'Panadería', 'Bebidas', 'Despensa'];

const ECO_FEATURES_LIST = [
    '100% Orgánico', 'Sin pesticidas', 'Cultivo local', 'Certificado orgánico', 'Sin químicos',
    'Cosecha fresca', 'Grano entero', 'Sin refinar', 'Alta fibra', 'Primera presión',
    'Sin aditivos', 'Botella de vidrio', 'Sin pasteurizar', 'Apicultura sostenible', 'Pura y natural',
    'Hierbas orgánicas', 'Empaque biodegradable', 'Sin sal', 'Sin tostar', 'Proteína natural',
    'Comercio justo', 'Tostado artesanal', 'Aromático', 'Alto en proteína', 'Sin gluten',
    'Superalimento', 'Hecho artesanal'
];

export function ProductFormDialog({ open, onClose, onProductCreated }: ProductFormDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductFormData>({
        defaultValues: {
            category: 'Vegetales',
            stock: 10,
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800'
        }
    });

    const onSubmit = async (data: ProductFormData) => {
        setIsLoading(true);
        try {
            if (selectedFeatures.length !== 3) {
                toast.warning('Debes seleccionar exactamente 3 características ecológicas');
                setIsLoading(false);
                return;
            }

            const newProduct = {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                category: data.category,
                stock: Number(data.stock),
                image: data.image,
                ecoFeatures: selectedFeatures
            };

            await productService.create(newProduct);
            toast.success('Producto creado exitosamente');
            reset();
            setSelectedFeatures([]);
            onProductCreated();
            onClose();
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Error al crear el producto');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                    <DialogDescription>
                        Ingresa los detalles del nuevo producto para añadirlo al catálogo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre del Producto</Label>
                                <Input
                                    id="name"
                                    placeholder="Ej. Manzanas Orgánicas"
                                    {...register('name', { required: 'El nombre es obligatorio' })}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Input
                                    id="category"
                                    placeholder="Ej. Frutas"
                                    {...register('category', { required: 'La categoría es obligatoria' })}
                                />
                                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe el producto..."
                                {...register('description', { required: 'La descripción es obligatoria' })}
                            />
                            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Precio ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    {...register('price', { required: 'El precio es obligatorio', min: 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Inicial</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    {...register('stock', { required: 'El stock es obligatorio', min: 0 })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">URL de Imagen</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="image"
                                    placeholder="https://..."
                                    {...register('image', { required: 'La URL de la imagen es obligatoria' })}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">URL de una imagen válida (Unsplash, etc.)</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Características Ecológicas (Selecciona 3)</Label>
                            <div className="h-40 overflow-y-auto border rounded-md p-2 grid grid-cols-1 gap-2">
                                {ECO_FEATURES_LIST.map((feature) => (
                                    <div key={feature} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`feature-${feature}`}
                                            value={feature}
                                            checked={selectedFeatures.includes(feature)}
                                            onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                if (isChecked) {
                                                    if (selectedFeatures.length < 3) {
                                                        setSelectedFeatures([...selectedFeatures, feature]);
                                                    } else {
                                                        toast.warning('Solo puedes seleccionar 3 características');
                                                    }
                                                } else {
                                                    setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <label
                                            htmlFor={`feature-${feature}`}
                                            className="text-sm cursor-pointer"
                                        >
                                            {feature}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {selectedFeatures.length !== 3 && (
                                <p className="text-xs text-yellow-600">Debes seleccionar exactamente 3 características ({selectedFeatures.length}/3)</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Producto
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
