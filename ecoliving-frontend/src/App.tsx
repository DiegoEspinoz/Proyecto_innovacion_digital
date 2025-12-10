import { useState, useEffect } from 'react';
import { ShoppingCart, Leaf, User, LogOut, LayoutDashboard, Store, X, ArrowLeft } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Toaster, toast } from 'sonner';
import { ProductCard } from './components/ProductCard';
import { ShoppingCartSheet } from './components/ShoppingCartSheet';
import { CheckoutDialog } from './components/CheckoutDialog';
import { AuthDialog } from './components/AuthDialog';
import { AdminDashboard } from './components/AdminDashboard';
import { UserMenuDropdown } from './components/UserMenuDropdown';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import { TermsAndConditionsPage } from './components/TermsAndConditionsPage';
import { AboutPage } from './components/AboutPage';
import { ShippingAddressDialog } from './components/ShippingAddressDialog';
import { Product, CartItem, User as UserType, Order, ShippingAddress } from './types';
import { storage } from './utils/storage';
import { productService, interestService, orderService, cartService } from './services/api.service';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showShippingDialog, setShowShippingDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [currentPage, setCurrentPage] = useState<'store' | 'profile' | 'settings' | 'terms' | 'about'>('store');
  const [tempShippingAddress, setTempShippingAddress] = useState<ShippingAddress | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Inicializar productos y usuario al cargar
  useEffect(() => {
    // Cargar productos desde el backend
    const loadProducts = async () => {
      try {
        const productsFromBackend = await productService.getAll();
        setProducts(productsFromBackend);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Error al cargar productos. Verifica que el backend esté corriendo.');
      }
    };

    loadProducts();

    // Verificar si hay usuario guardado
    const user = storage.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Cargar carrito desde el backend solo si hay usuario
      loadCart();
      // Cargar productos recomendados
      loadRecommendedProducts();
      // Cargar productos relacionados guardados
      const savedRelated = localStorage.getItem(`related_${user.id}`);
      if (savedRelated) {
        setRelatedProducts(JSON.parse(savedRelated));
      }
    }
  }, []);

  // Cargar productos recomendados
  const loadRecommendedProducts = async () => {
    try {
      const recommended = await interestService.getRecommendedProducts();
      setRecommendedProducts(recommended);
    } catch (error) {
      console.error('Error loading recommended products:', error);
      // No mostrar error al usuario, simplemente no cargar recomendados
    }
  };

  // Cargar carrito
  const loadCart = async () => {
    try {
      const cartData = await cartService.getCart();
      // Convertir los datos del backend al formato del frontend
      const items: CartItem[] = cartData.map((item: any) => ({
        product: item.product,
        quantity: item.quantity
      }));
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
      // No mostrar error al usuario, el carrito estará vacío
    }
  };

  const handleProductClick = async (product: Product) => {
    if (currentUser) {
      try {
        await interestService.trackProductInterest(product.id);
        // Recargar productos recomendados
        await loadRecommendedProducts();
      } catch (error) {
        console.error('Error tracking product interest:', error);
      }
    }
  };

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setViewMode('admin');
    }
  };

  const handleLogout = () => {
    // Limpiar carrito y productos relacionados del localStorage
    if (currentUser) {
      localStorage.removeItem(`cart_${currentUser.id}`);
      localStorage.removeItem(`related_${currentUser.id}`);
    }
    storage.setCurrentUser(null);
    storage.removeToken();
    setCurrentUser(null);
    setCartItems([]);
    setRelatedProducts([]);
    setViewMode('store');
    setCurrentPage('store');
    toast.success('Sesión cerrada');
  };

  const handleUserMenuOption = (option: 'profile' | 'settings' | 'terms' | 'about') => {
    setCurrentPage(option);
  };

  const handleAddToCart = async (product: Product) => {
    if (!currentUser) {
      setShowAuth(true);
      toast.error('Inicia sesión para agregar productos al carrito');
      return;
    }

    try {
      // Agregar al carrito en el backend
      await cartService.addToCart(product.id, 1);

      // Recargar carrito desde el backend
      await loadCart();

      // Mostrar productos relacionados de la misma categoría
      const related = products
        .filter((p: Product) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
      setRelatedProducts(related);
      // Guardar productos relacionados en localStorage
      localStorage.setItem(`related_${currentUser.id}`, JSON.stringify(related));

      toast.success(`${product.name} agregado al carrito`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar al carrito');
    }
  };

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
      return;
    }

    try {
      await cartService.updateCartItem(productId, quantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Error al actualizar el carrito');
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await cartService.removeFromCart(productId);
      await loadCart();
      toast.info('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Error al eliminar del carrito');
    }
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowShippingDialog(true);
  };

  const handleShippingAddressConfirm = (address: ShippingAddress) => {
    setTempShippingAddress(address);
    setShowShippingDialog(false);
    setShowCheckout(true);
  };

  const handleConfirmPayment = async (paymentMethod: string, cardDetails?: any) => {
    console.log('✅ handleConfirmPayment llamado!', { paymentMethod, cardDetails, currentUser, tempShippingAddress });

    if (!currentUser || !tempShippingAddress) {
      console.log('❌ Falta currentUser o tempShippingAddress');
      return;
    }

    console.log('🚀 Iniciando proceso de confirmación...');

    // ACCIÓN INMEDIATA EN EL FRONTEND (sin esperar backend)
    // 1. Cerrar todos los diálogos inmediatamente
    console.log('1️⃣ Cerrando diálogos...');
    setShowCheckout(false);
    setShowShippingDialog(false);
    setShowCart(false);

    // 2. Limpiar carrito local y dirección temporal
    console.log('2️⃣ Limpiando carrito local...');
    setCartItems([]);
    setTempShippingAddress(null);

    // 3. Redirigir al inicio inmediatamente
    console.log('3️⃣ Redirigiendo a la página principal...');
    setCurrentPage('store');

    // 4. Scroll al inicio de la página
    console.log('4️⃣ Haciendo scroll...');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 5. Mostrar mensaje de confirmación prominente
    console.log('5️⃣ Mostrando mensaje de confirmación...');
    toast.success('¡Compra confirmada!', {
      description: 'Tu pedido ha sido procesado exitosamente. Tu carrito ha sido vaciado.',
      duration: 4000
    });

    console.log('✨ Proceso de frontend completado!');

    // ACCIONES EN SEGUNDO PLANO (no bloquean la UI)
    // Preparar datos de la orden para el backend
    const orderData = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      paymentMethod,
      shippingAddress: tempShippingAddress
    };

    // Intentar crear orden en el backend (en segundo plano)
    try {
      console.log('📡 Enviando orden al backend...');
      await orderService.create(orderData);
      console.log('✅ Orden creada en el backend');

      // Limpiar carrito en el backend
      try {
        console.log('🗑️ Limpiando carrito en el backend...');
        await cartService.clearCart();
        console.log('✅ Carrito limpiado en el backend');
      } catch (error) {
        console.error('Error clearing cart:', error);
      }

      // Recargar productos para actualizar stock
      try {
        console.log('🔄 Recargando productos...');
        const updatedProducts = await productService.getAll();
        setProducts(updatedProducts);
        console.log('✅ Productos recargados');
      } catch (error) {
        console.error('Error reloading products:', error);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      // No mostrar error al usuario ya que la UI ya se actualizó
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    // Solo buscar en nombre, y solo si hay al menos 3 letras
    const matchesSearch = searchQuery.length < 3 ||
      (searchQuery.length >= 3 && product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (viewMode === 'admin' && currentUser?.role === 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" />

        {/* Admin Header */}
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-green-600" />
                <span>Panel de Administración - ECOLIVING</span>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setViewMode('store')}>
                  <Store className="w-4 h-4 mr-2" />
                  Ver Tienda
                </Button>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{currentUser.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <AdminDashboard products={products} />
      </div>
    );
  }

  // Renderizar páginas secundarias
  if (currentPage !== 'store' && currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Toaster position="top-right" />

        {/* Header para páginas secundarias */}
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <Button variant="ghost" onClick={() => setCurrentPage('store')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la Tienda
              </Button>
              <div className="flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-600" />
                <span>ECOLIVING</span>
              </div>
              <UserMenuDropdown
                user={currentUser}
                onSelectOption={handleUserMenuOption}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {currentPage === 'profile' && <ProfilePage user={currentUser} />}
          {currentPage === 'settings' && <SettingsPage userId={currentUser.id} />}
          {currentPage === 'terms' && <TermsAndConditionsPage />}
          {currentPage === 'about' && <AboutPage />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('store')}>
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl">ECOLIVING</h1>
                <p className="text-xs text-muted-foreground">Alimentos Orgánicos</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  {currentUser.role?.toLowerCase() === 'admin' && (
                    <Button variant="outline" size="sm" onClick={() => setViewMode('admin')}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                  <UserMenuDropdown
                    user={currentUser}
                    onSelectOption={handleUserMenuOption}
                    onLogout={handleLogout}
                  />
                </>
              ) : (
                <Button onClick={() => setShowAuth(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
              )}

              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setShowCart(true)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Renderizar Admin Dashboard o Store */}
      {viewMode === 'admin' ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <Button variant="outline" onClick={() => setViewMode('store')}>
              <Store className="w-4 h-4 mr-2" />
              Volver a la Tienda
            </Button>
          </div>
          <AdminDashboard products={products} />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-green-50 to-blue-50 py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2>Alimentos Orgánicos y Saludables</h2>
                <p className="text-muted-foreground mt-2 mb-6">
                  Productos 100% orgánicos, frescos y naturales directo a tu mesa
                </p>

                {/* Search and Filter */}
                <div className="flex flex-col gap-3 max-w-2xl mx-auto">
                  <Input
                    placeholder="Buscar productos... (mínimo 3 letras)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      variant={categoryFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategoryFilter('all')}
                    >
                      Todas las categorías
                    </Button>
                    {categories.filter(c => c !== 'all').map(category => (
                      <Button
                        key={category}
                        variant={categoryFilter === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCategoryFilter(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Productos Relacionados por Categoría */}
          {relatedProducts.length > 0 && (
            <section className="container mx-auto px-4 py-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">Productos de la misma categoría</h2>
                <p className="text-muted-foreground">
                  Otros productos que podrían interesarte
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(product => (
                  <div key={product.id} onClick={() => handleProductClick(product)}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Productos Recomendados */}
          {recommendedProducts.length > 0 && (
            <section className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-bold mb-6">Productos recomendados para ti</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map(product => (
                  <div key={product.id} onClick={() => handleProductClick(product)}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Products Grid */}
          <section className="container mx-auto px-4 py-12">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron productos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} onClick={() => handleProductClick(product)}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Features Section */}
          <section className="bg-muted/50 py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="mb-2">100% Orgánico</h3>
                  <p className="text-sm text-muted-foreground">
                    Alimentos certificados sin pesticidas ni químicos
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2">Envío Gratis</h3>
                  <p className="text-sm text-muted-foreground">
                    En todos los pedidos sin mínimo de compra
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutDashboard className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="mb-2">Pago Seguro</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistema de pagos protegido y confiable
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t py-8">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p>© 2025 ECOLIVING. Plataforma de demostración con pagos ficticios.</p>
            </div>
          </footer>
        </>
      )}

      {/* Dialogs */}
      <AuthDialog
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={handleLogin}
      />

      <ShoppingCartSheet
        open={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <ShippingAddressDialog
        open={showShippingDialog}
        onClose={() => setShowShippingDialog(false)}
        defaultName={currentUser?.name || ''}
        onConfirm={handleShippingAddressConfirm}
      />

      <CheckoutDialog
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}
