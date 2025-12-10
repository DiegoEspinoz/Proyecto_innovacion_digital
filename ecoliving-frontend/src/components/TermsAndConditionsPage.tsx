import { FileText, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

export function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2>Términos y Condiciones</h2>
        <p className="text-muted-foreground">Políticas de uso de ECOLIVING</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Términos de Servicio
          </CardTitle>
          <CardDescription>Última actualización: Noviembre 2025</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <section>
            <h3 className="mb-2">1. Aceptación de los Términos</h3>
            <p className="text-muted-foreground">
              Al acceder y utilizar ECOLIVING, aceptas cumplir con estos términos y condiciones. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestros servicios.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2">2. Uso de la Plataforma</h3>
            <p className="text-muted-foreground">
              ECOLIVING es una plataforma de demostración para la venta de productos orgánicos. 
              Los usuarios se comprometen a proporcionar información veraz y a utilizar la plataforma 
              de manera responsable.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2">3. Productos y Precios</h3>
            <p className="text-muted-foreground">
              Todos los productos mostrados están sujetos a disponibilidad. Los precios pueden 
              variar sin previo aviso. Nos reservamos el derecho de modificar o descontinuar 
              productos en cualquier momento.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2">4. Proceso de Compra</h3>
            <p className="text-muted-foreground">
              Al realizar una compra, el usuario acepta que la información proporcionada es correcta. 
              Los pagos en esta plataforma son simulados con fines demostrativos.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2">5. Privacidad de Datos</h3>
            <p className="text-muted-foreground">
              Respetamos tu privacidad. Los datos se almacenan localmente en tu navegador mediante 
              localStorage. No compartimos información personal con terceros. Esta plataforma no 
              está diseñada para recopilar información personal identificable (PII) sensible.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2">6. Limitación de Responsabilidad</h3>
            <p className="text-muted-foreground">
              ECOLIVING es una plataforma de demostración. No nos hacemos responsables por cualquier 
              daño directo, indirecto, incidental o consecuente que resulte del uso de la plataforma.
            </p>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Política de Reembolsos
          </CardTitle>
          <CardDescription>Condiciones para devoluciones y reembolsos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <section>
            <h3 className="mb-2">1. Periodo de Devolución</h3>
            <p className="text-muted-foreground">
              Aceptamos devoluciones dentro de los 7 días posteriores a la recepción del producto, 
              siempre que el producto esté en su estado original y sin abrir (aplicable a productos 
              alimenticios por razones de seguridad).
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2">2. Productos Elegibles</h3>
            <p className="text-muted-foreground">
              Los productos orgánicos perecederos no son elegibles para reembolso una vez abiertos. 
              Sin embargo, si recibes un producto dañado o en mal estado, contacta con nuestro 
              servicio al cliente dentro de las 24 horas siguientes a la entrega.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2">3. Proceso de Reembolso</h3>
            <p className="text-muted-foreground">
              Una vez aprobada la devolución, procesaremos el reembolso en un plazo de 5-10 días 
              hábiles. El reembolso se realizará al mismo método de pago utilizado en la compra original.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2">4. Productos Defectuosos</h3>
            <p className="text-muted-foreground">
              Si recibes un producto defectuoso o dañado, te ofreceremos un reemplazo sin costo 
              adicional o un reembolso completo, según tu preferencia.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2">5. Gastos de Envío</h3>
            <p className="text-muted-foreground">
              Los gastos de envío para devoluciones serán cubiertos por ECOLIVING en caso de 
              productos defectuosos o errores en el pedido. En otros casos, los gastos de devolución 
              correrán a cargo del cliente.
            </p>
          </section>

          <Separator />

          <section>
            <h3 className="mb-2">6. Contacto</h3>
            <p className="text-muted-foreground">
              Para solicitar un reembolso o más información, contacta con nuestro equipo de soporte 
              en: soporte@ecoliving.com o llama al +1 (555) 123-4567
            </p>
          </section>

          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-900">
              ℹ️ Nota: Esta es una plataforma de demostración. Las políticas aquí descritas 
              son simuladas con fines educativos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
