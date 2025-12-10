import { Leaf, Heart, Users, Award, ShieldCheck, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2>Acerca de ECOLIVING</h2>
        <p className="text-muted-foreground">Tu tienda de confianza para alimentos orgánicos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            Nuestra Historia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            ECOLIVING nació de la pasión por ofrecer alimentos orgánicos de la más alta calidad 
            directamente a tu hogar. Fundada en 2020, nuestra misión es hacer que la alimentación 
            saludable y sostenible sea accesible para todos.
          </p>
          <p className="text-muted-foreground">
            Trabajamos directamente con agricultores locales certificados, garantizando que cada 
            producto que llega a tu mesa cumple con los más altos estándares de calidad orgánica.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Nuestra Misión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Promover un estilo de vida saludable y sostenible, ofreciendo productos orgánicos 
              certificados que benefician tanto a nuestros clientes como al medio ambiente.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Nuestra Visión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ser la plataforma líder en comercio de alimentos orgánicos, conectando a productores 
              locales con consumidores conscientes en todo el país.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>¿Por qué elegirnos?</CardTitle>
          <CardDescription>Los beneficios de comprar en ECOLIVING</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="mb-1">Productos Certificados</h4>
                <p className="text-sm text-muted-foreground">
                  Todos nuestros productos cuentan con certificación orgánica verificada
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="mb-1">Pago Seguro</h4>
                <p className="text-sm text-muted-foreground">
                  Sistema de pagos protegido con las mejores tecnologías de seguridad
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="mb-1">Envío Gratis</h4>
                <p className="text-sm text-muted-foreground">
                  Entrega sin costo adicional en todos tus pedidos
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="mb-1">100% Orgánico</h4>
                <p className="text-sm text-muted-foreground">
                  Sin pesticidas, químicos ni modificaciones genéticas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nuestros Valores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="mb-1">Sostenibilidad</h4>
            <p className="text-muted-foreground">
              Promovemos prácticas agrícolas que respetan el medio ambiente y conservan los 
              recursos naturales para las futuras generaciones.
            </p>
          </div>
          <div>
            <h4 className="mb-1">Calidad</h4>
            <p className="text-muted-foreground">
              Cada producto es cuidadosamente seleccionado y verificado para garantizar que 
              cumple con nuestros estándares de excelencia.
            </p>
          </div>
          <div>
            <h4 className="mb-1">Transparencia</h4>
            <p className="text-muted-foreground">
              Creemos en la honestidad total sobre el origen de nuestros productos y nuestros 
              procesos de producción.
            </p>
          </div>
          <div>
            <h4 className="mb-1">Comunidad</h4>
            <p className="text-muted-foreground">
              Apoyamos a los agricultores locales y construimos relaciones duraderas con 
              nuestros productores y clientes.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Leaf className="w-12 h-12 text-green-600 mx-auto" />
            <h3>Únete a la Revolución Orgánica</h3>
            <p className="text-sm text-muted-foreground">
              Más de 10,000 clientes satisfechos confían en ECOLIVING para sus alimentos orgánicos
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <p className="text-blue-900">
          ℹ️ Nota: ECOLIVING es una plataforma de demostración creada con fines educativos. 
          Los productos y servicios aquí mostrados son simulados.
        </p>
      </div>
    </div>
  );
}
