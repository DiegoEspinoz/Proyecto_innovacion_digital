import { useState, useEffect } from 'react';
import { Package, Calendar, CreditCard, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Order } from '../types';
import { orderService } from '../services/api.service';

interface OrderHistoryPageProps {
  userId: number;
}

export function OrderHistoryPage({ userId }: OrderHistoryPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        console.log('🔍 Cargando órdenes para usuario:', userId);
        const userOrders = await orderService.getByUserId(userId);
        console.log('✅ Órdenes cargadas:', userOrders.length, userOrders);
        // Ordenar por fecha más reciente
        userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(userOrders);
      } catch (error) {
        console.error('❌ Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [userId]);

  const toggleOrderExpand = (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Tarjeta de Crédito/Débito';
      case 'paypal':
        return 'PayPal';
      case 'transfer':
        return 'Transferencia Bancaria';
      default:
        return method;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div>
          <h2>Historial de Compras</h2>
          <p className="text-muted-foreground">Todas tus órdenes en ECOLIVING</p>
        </div>

        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Aún no has realizado ninguna compra
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2>Historial de Compras</h2>
        <p className="text-muted-foreground">
          {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} realizados
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrders.has(order.id);
          const orderDate = new Date(order.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Pedido #{order.id}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />
                      {orderDate}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Método de pago:</span>
                    </div>
                    <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
                  </div>

                  {order.shippingAddress && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <span className="text-muted-foreground">Dirección de envío:</span>
                        <p className="mt-1">
                          {order.shippingAddress.name}<br />
                          {order.shippingAddress.street}
                          {order.shippingAddress.avenue && `, ${order.shippingAddress.avenue}`}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                          Tel: {order.shippingAddress.phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {isExpanded && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm">Productos:</p>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm bg-muted/50 p-2 rounded">
                            <span>
                              {item.product.name} x{item.quantity}
                            </span>
                            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <Separator />
                    </>
                  )}

                  <div className="flex justify-between pt-2">
                    <span>Total</span>
                    <span className="text-green-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
