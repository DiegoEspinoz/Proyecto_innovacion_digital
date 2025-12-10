package com.ecoliving.controller;

import com.ecoliving.repository.UserRepository;
import com.ecoliving.security.SecurityUtils;
import com.ecoliving.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
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

    @GetMapping
    public ResponseEntity<List<CartService.CartItemDto>> getCart(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        Long actualUserId = getUserIdFromHeaderOrToken(userId);
        return ResponseEntity.ok(cartService.getCart(actualUserId));
    }

    @PostMapping
    public ResponseEntity<CartService.CartItemDto> addToCart(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody Map<String, Object> request) {
        Long actualUserId = getUserIdFromHeaderOrToken(userId);
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = request.containsKey("quantity") 
            ? Integer.valueOf(request.get("quantity").toString()) 
            : 1;
        return ResponseEntity.ok(cartService.addToCart(actualUserId, productId, quantity));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<CartService.CartItemDto> updateCartItem(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long productId,
            @RequestBody Map<String, Object> request) {
        Long actualUserId = getUserIdFromHeaderOrToken(userId);
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        return ResponseEntity.ok(cartService.updateCartItem(actualUserId, productId, quantity));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long productId) {
        Long actualUserId = getUserIdFromHeaderOrToken(userId);
        cartService.removeFromCart(actualUserId, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        Long actualUserId = getUserIdFromHeaderOrToken(userId);
        cartService.clearCart(actualUserId);
        return ResponseEntity.ok().build();
    }
}
