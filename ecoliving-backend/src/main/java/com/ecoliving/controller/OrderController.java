package com.ecoliving.controller;

import com.ecoliving.dto.OrderRequest;
import com.ecoliving.model.Order;
import com.ecoliving.repository.UserRepository;
import com.ecoliving.security.SecurityUtils;
import com.ecoliving.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    private Long getUserIdFromHeaderOrToken(@RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId != null) {
            return userId;
        }
        // Intentar obtener del token JWT
        String email = SecurityUtils.getCurrentUserEmail();
        if (email != null) {
            return userRepository.findByEmail(email)
                    .map(user -> user.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("User ID required");
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody OrderRequest request) {
        Long actualUserId = getUserIdFromHeaderOrToken(userId);
        return ResponseEntity.ok(orderService.createOrder(actualUserId, request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    private final com.ecoliving.service.PdfService pdfService;

    @GetMapping("/{id}/receipt")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        byte[] pdfBytes = pdfService.generateReceipt(order);

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=receipt-" + id + ".pdf")
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
