import { ShoppingCart, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Product, Event } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useEffect, useState } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

  useEffect(() => {
    // Verificar si hay un evento activo
    const savedEvent = localStorage.getItem('activeEvent');
    if (savedEvent) {
      const event: Event = JSON.parse(savedEvent);
      if (event.isActive && event.productIds.includes(product.id)) {
        setActiveEvent(event);
        setDiscountedPrice(product.price * (1 - event.discountPercentage / 100));
      } else {
        setActiveEvent(null);
        setDiscountedPrice(null);
      }
    } else {
      setActiveEvent(null);
      setDiscountedPrice(null);
    }
  }, [product.id, product.price]);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
      {activeEvent && discountedPrice && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-red-500 text-white shadow-lg">
            <Tag className="w-3 h-3 mr-1" />
            -{activeEvent.discountPercentage}%
          </Badge>
        </div>
      )}
      <div className="aspect-square overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="line-clamp-2">{product.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.ecoFeatures?.slice(0, 2).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {discountedPrice ? (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-primary text-lg">
                  ${discountedPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-primary">${product.price.toFixed(2)}</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            Stock: {product.stock}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}