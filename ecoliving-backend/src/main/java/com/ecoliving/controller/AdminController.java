package com.ecoliving.controller;

import com.ecoliving.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/sales-by-category")
    public ResponseEntity<List<Map<String, Object>>> getSalesByCategory() {
        return ResponseEntity.ok(adminService.getSalesByCategory());
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts() {
        return ResponseEntity.ok(adminService.getTopProducts());
    }

    @GetMapping("/sales-by-payment")
    public ResponseEntity<Map<String, Double>> getSalesByPaymentMethod() {
        return ResponseEntity.ok(adminService.getSalesByPaymentMethod());
    }
}

