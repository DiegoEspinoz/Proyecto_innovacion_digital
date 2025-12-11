import { useState, useMemo, useEffect } from 'react';
import { Package, DollarSign, ShoppingCart, Users, TrendingUp, Calendar, Sparkles, CreditCard, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Order, Product } from '../types';
import { orderService, userService } from '../services/api.service';
import { EventsManager } from './EventsManager';
import { ProductFormDialog } from './ProductFormDialog';

interface AdminDashboardProps {
  products: Product[];
  onRefresh: () => void;
}

export function AdminDashboard({ products, onRefresh }: AdminDashboardProps) {
  console.log('🎨 AdminDashboard renderizado con', products.length, 'productos');

  const [timeRange, setTimeRange] = useState('month');
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Cargar órdenes y usuarios desde el backend
  useEffect(() => {
    console.log('🚀 useEffect ejecutándose');

    const loadData = async () => {
      console.log('📥 loadData iniciado');
      try {
        console.log('1️⃣ Estableciendo loading...');
        setLoading(true);

        // Cargar órdenes
        console.log('2️⃣ Llamando a orderService.getAll()...');
        const allOrders = await orderService.getAll();
        console.log('3️⃣ Órdenes recibidas:', allOrders);
        setOrders(allOrders);
        console.log('📊 Órdenes cargadas:', allOrders.length);

        // Cargar usuarios
        console.log('4️⃣ Llamando a userService.getAll()...');
        const allUsers = await userService.getAll();
        console.log('5️⃣ Usuarios recibidos:', allUsers);
        setUsers(allUsers);
        console.log('👥 Usuarios cargados:', allUsers.length);
      } catch (error) {
        console.error('❌ Error loading data:', error);
        setOrders([]);
        setUsers([]);
      } finally {
        console.log('6️⃣ Finalizando...');
        setLoading(false);
      }
    };
    console.log('🔄 Llamando a loadData()...');
    loadData();
  }, []);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dailyOrders = orders.filter(o => new Date(o.createdAt) >= today);
    const weeklyOrders = orders.filter(o => new Date(o.createdAt) >= weekAgo);
    const monthlyOrders = orders.filter(o => new Date(o.createdAt) >= monthAgo);

    return {
      daily: dailyOrders.reduce((sum, o) => sum + o.total, 0),
      weekly: weeklyOrders.reduce((sum, o) => sum + o.total, 0),
      monthly: monthlyOrders.reduce((sum, o) => sum + o.total, 0),
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      totalCustomers: users.length,
      totalProducts: products.length,
      lowStock: products.filter(p => p.stock < 20).length
    };
  }, [orders, users, products]);

  // Datos para gráfico de ventas por día
  const salesChartData = useMemo(() => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });

      last7Days.push({
        date: dateStr,
        ventas: dayOrders.reduce((sum, o) => sum + o.total, 0),
        ordenes: dayOrders.length
      });
    }

    return last7Days;
  }, [orders]);

  // Datos para tabla de categorías del mes
  const categorySalesData = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const categories: { [key: string]: { quantity: number; revenue: number } } = {};

    orders
      .filter(order => new Date(order.createdAt) >= monthStart)
      .forEach(order => {
        order.items.forEach(item => {
          const category = item.product.category;
          if (!categories[category]) {
            categories[category] = { quantity: 0, revenue: 0 };
          }
          categories[category].quantity += item.quantity;
          categories[category].revenue += item.product.price * item.quantity;
        });
      });

    return Object.entries(categories)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  // Top productos del mes
  const topProducts = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const productSales: { [key: string]: { product: Product; quantity: number; revenue: number } } = {};

    orders
      .filter(order => new Date(order.createdAt) >= monthStart)
      .forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.product.id]) {
            productSales[item.product.id] = {
              product: item.product,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[item.product.id].quantity += item.quantity;
          productSales[item.product.id].revenue += item.product.price * item.quantity;
        });
      });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  // Ventas por tarjeta
  const cardSales = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyOrders = orders.filter(order => new Date(order.createdAt) >= monthStart);
    return monthlyOrders
      .filter(order => order.paymentMethod.toLowerCase() === 'card' || order.paymentMethod.toLowerCase() === 'tarjeta')
      .reduce((sum, order) => sum + order.total, 0);
  }, [orders]);


  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Panel de Administración</h1>
          <p className="text-muted-foreground">
            Gestiona tu tienda y visualiza estadísticas en tiempo real
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +${stats.monthly.toFixed(2)} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pedidos Totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              En toda la historia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStock} con stock bajo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="events">
            <Sparkles className="w-4 h-4 mr-2" />
            Eventos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ventas Últimos 7 Días</CardTitle>
                <CardDescription>Evolución de ventas diarias</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ventas" stroke="#22c55e" name="Ventas ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ventas por Categoría</CardTitle>
                <CardDescription>Categorías más vendidas del mes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Cantidad Vendida</TableHead>
                      <TableHead className="text-right">Ingresos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categorySalesData.length > 0 ? (
                      categorySalesData.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.revenue.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No hay ventas este mes
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 Productos Más Vendidos del Mes</CardTitle>
              <CardDescription>Productos con mayor ingreso generado este mes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Cantidad Vendida</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((item, index) => (
                    <TableRow key={item.product.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">#{index + 1}</span>
                          {item.product.name}
                        </div>
                      </TableCell>
                      <TableCell>{item.product.category}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.revenue.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Método de Pago</CardTitle>
              <CardDescription>Ingresos del mes actual por método de pago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ventas por Tarjeta</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${cardSales.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total del mes actual
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventario de Productos</CardTitle>
              <CardDescription>Estado actual del stock</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{product.stock}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={product.stock < 20 ? 'destructive' : product.stock < 50 ? 'secondary' : 'default'}>
                          {product.stock === 0 ? 'Sin Stock' : product.stock < 20 ? 'Stock Bajo' : 'Disponible'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
              <CardDescription>Últimas transacciones registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice().reverse().slice(0, 10).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        #{String(order.id)}
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell className="capitalize">{order.paymentMethod}</TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status === 'completed' ? 'Completado' : 'Pendiente'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No hay pedidos registrados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <EventsManager products={products} />
        </TabsContent>
      </Tabs>
      <ProductFormDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onProductCreated={onRefresh}
      />
    </div>
  );
}