package com.ecoliving.controller;

import com.ecoliving.dto.ProductDto;
import com.ecoliving.repository.UserRepository;
import com.ecoliving.security.SecurityUtils;
import com.ecoliving.service.InterestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interests")
@RequiredArgsConstructor
public class InterestController {

    private final InterestService interestService;
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

    @PostMapping("/{productId}")
    public ResponseEntity<Void> trackProductInterest(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long productId) {
        try {
            Long actualUserId = getUserIdFromHeaderOrToken(userId);
            interestService.trackProductInterest(actualUserId, productId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<ProductDto>> getRecommendedProducts(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        try {
            Long actualUserId = getUserIdFromHeaderOrToken(userId);
            return ResponseEntity.ok(interestService.getRecommendedProducts(actualUserId));
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }
}

