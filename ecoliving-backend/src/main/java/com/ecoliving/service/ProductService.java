package com.ecoliving.service;

import com.ecoliving.dto.ProductDto;
import com.ecoliving.model.Product;
import com.ecoliving.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductDto::from)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ProductDto.from(product);
    }

    public List<ProductDto> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(ProductDto::from)
                .collect(Collectors.toList());
    }

    public List<ProductDto> searchProducts(String query) {
        if (query.length() < 3) {
            return List.of();
        }
        return productRepository.searchByName(query).stream()
                .map(ProductDto::from)
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }
}

