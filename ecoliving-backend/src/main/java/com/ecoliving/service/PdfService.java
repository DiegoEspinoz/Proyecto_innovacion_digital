package com.ecoliving.service;

import com.ecoliving.model.Order;
import com.ecoliving.model.OrderItem;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generateReceipt(Order order) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);

            document.open();

            // Fonts
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

            // Title
            Paragraph title = new Paragraph("Comprobante de Pago - ECOLIVING", headerFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));

            // Order Details
            document.add(new Paragraph("Orden #" + order.getId(), subHeaderFont));
            document.add(new Paragraph(
                    "Fecha: " + order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                    normalFont));
            document.add(new Paragraph("Cliente: " + order.getCustomerName(), normalFont));
            document.add(new Paragraph("Email: " + order.getCustomerEmail(), normalFont));
            document.add(new Paragraph("Método de Pago: " + order.getPaymentMethod(), normalFont));

            if (order.getShippingAddress() != null) {
                document.add(new Paragraph("Dirección de Envío: " + order.getShippingAddress().getStreet() + ", "
                        + order.getShippingAddress().getCity(), normalFont));
            }

            document.add(new Paragraph("\n"));

            // Items Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 4, 2, 2, 2 });

            // Table Header
            addTableHeader(table, "Producto", subHeaderFont);
            addTableHeader(table, "Precio Unit.", subHeaderFont);
            addTableHeader(table, "Cantidad", subHeaderFont);
            addTableHeader(table, "Total", subHeaderFont);

            // Items
            for (OrderItem item : order.getItems()) {
                table.addCell(new PdfPCell(new Phrase(item.getProduct().getName(), normalFont)));
                table.addCell(
                        new PdfPCell(new Phrase("$" + String.format("%.2f", item.getPriceAtPurchase()), normalFont)));
                table.addCell(new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), normalFont)));
                table.addCell(new PdfPCell(
                        new Phrase("$" + String.format("%.2f", item.getPriceAtPurchase() * item.getQuantity()),
                                normalFont)));
            }

            document.add(table);

            document.add(new Paragraph("\n"));

            // Total
            Paragraph total = new Paragraph("Total Pagado: $" + String.format("%.2f", order.getTotal()), headerFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            // Footer
            document.add(new Paragraph("\n\n"));
            Paragraph footer = new Paragraph("Gracias por tu compra en ECOLIVING!\nContáctanos: soporte@ecoliving.com",
                    normalFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private void addTableHeader(PdfPTable table, String headerTitle, Font font) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
        header.setPhrase(new Phrase(headerTitle, font));
        header.setPadding(5);
        table.addCell(header);
    }
}
