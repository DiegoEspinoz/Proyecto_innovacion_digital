package com.ecoliving.service;

import com.ecoliving.dto.ProductDto;
import com.ecoliving.model.Product;
import com.ecoliving.model.User;
import com.ecoliving.model.UserProductInterest;
import com.ecoliving.repository.ProductRepository;
import com.ecoliving.repository.UserProductInterestRepository;
import com.ecoliving.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterestService {

    private final UserProductInterestRepository interestRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public void trackProductInterest(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if already exists
        if (!interestRepository.existsByUserAndProduct(user, product)) {
            UserProductInterest interest = new UserProductInterest();
            interest.setUser(user);
            interest.setProduct(product);
            interestRepository.save(interest);
        }
    }

    public List<ProductDto> getRecommendedProducts(Long userId) {
        List<Long> productIds = interestRepository.findRecentProductIdsByUserId(userId);
        return productIds.stream()
                .limit(4)
                .map(productRepository::findById)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(com.ecoliving.dto.ProductDto::from)
                .collect(Collectors.toList());
    }
}

