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
    private final com.ecoliving.repository.ProductEcoFeaturesRepository productEcoFeaturesRepository;

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToDto(product);
    }

    public List<ProductDto> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> searchProducts(String query) {
        if (query.length() < 3) {
            return List.of();
        }
        return productRepository.searchByName(query).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    public ProductDto saveProduct(ProductDto productDto) {
        // 1. Generate a shared ID for the 3 features
        Long sharedId = System.currentTimeMillis();

        // 2. Create the 3 ProductEcoFeatures objects first
        if (productDto.getEcoFeatures() != null) {
            for (String feature : productDto.getEcoFeatures()) {
                com.ecoliving.model.ProductEcoFeatures ecoFeature = new com.ecoliving.model.ProductEcoFeatures();
                ecoFeature.setSharedId(sharedId);
                ecoFeature.setFeature(feature);
                productEcoFeaturesRepository.save(ecoFeature);
            }
        }

        // 3. Create the Product and link the shared ID
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setCategory(productDto.getCategory());
        product.setImage(productDto.getImage());
        product.setStock(productDto.getStock());
        product.setEcoFeaturesGroupId(sharedId);

        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = ProductDto.from(product);
        if (product.getEcoFeaturesGroupId() != null) {
            List<String> features = productEcoFeaturesRepository.findBySharedId(product.getEcoFeaturesGroupId())
                    .stream()
                    .map(com.ecoliving.model.ProductEcoFeatures::getFeature)
                    .collect(Collectors.toList());
            dto.setEcoFeatures(features);
        }
        return dto;
    }
}
