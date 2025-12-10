# ECOLIVING Backend

Backend API para la plataforma ECOLIVING desarrollado con Spring Boot y MySQL.

## Requisitos

- Java 17 o superior
- Maven 3.6+
- MySQL 8.0+

## Configuración Local

1. Asegúrate de que MySQL esté corriendo en `localhost:3306`
2. Las credenciales por defecto son:
   - Username: `root`
   - Password: `admin`
   - Database: `ecoliving_db` (se creará automáticamente)

3. Las tablas se crearán automáticamente al iniciar la aplicación gracias a JPA/Hibernate con `ddl-auto=update`

## Ejecutar la Aplicación

```bash
mvn spring-boot:run
```

La aplicación estará disponible en `http://localhost:8080`

## Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/{id}` - Obtener producto por ID
- `GET /api/products/category/{category}` - Obtener productos por categoría
- `GET /api/products/search?q={query}` - Buscar productos (mínimo 3 letras)

### Categorías
- `GET /api/categories` - Obtener todas las categorías

### Intereses
- `POST /api/interests/{productId}` - Registrar interés en un producto (requiere header `X-User-Id`)
- `GET /api/interests/recommended` - Obtener productos recomendados (requiere header `X-User-Id`)

### Órdenes
- `POST /api/orders` - Crear nueva orden (requiere header `X-User-Id`)
- `GET /api/orders/user/{userId}` - Obtener órdenes de un usuario
- `GET /api/orders/{id}` - Obtener orden por ID

### Admin
- `GET /api/admin/stats` - Estadísticas generales
- `GET /api/admin/sales-by-category` - Ventas por categoría del mes
- `GET /api/admin/top-products` - Top 5 productos más vendidos del mes
- `GET /api/admin/sales-by-payment` - Ventas por método de pago del mes

## Deployment en Render

1. Configura las variables de entorno en Render:
   - `DATABASE_URL` - URL de conexión a MySQL (Railway)
   - `DB_USERNAME` - Usuario de la base de datos
   - `DB_PASSWORD` - Contraseña de la base de datos
   - `JWT_SECRET` - Clave secreta para JWT (mínimo 256 bits)
   - `FRONTEND_URL` - URL del frontend en Vercel

2. Build command: `mvn clean package`
3. Start command: `java -jar target/ecoliving-backend-1.0.0.jar`

## Base de Datos

Las tablas se crean automáticamente al iniciar la aplicación. Las tablas incluyen:
- `users` - Usuarios del sistema
- `products` - Productos
- `orders` - Órdenes
- `order_items` - Items de las órdenes
- `shipping_addresses` - Direcciones de envío
- `user_product_interests` - Intereses de productos por usuario
- `events` - Eventos promocionales

