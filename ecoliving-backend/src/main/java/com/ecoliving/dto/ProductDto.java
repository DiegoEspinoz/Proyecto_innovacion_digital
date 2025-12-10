package com.ecoliving.dto;

import com.ecoliving.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private String image;
    private Integer stock;
    private List<String> ecoFeatures;

    public static ProductDto from(Product product) {
        return new ProductDto(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getCategory(),
            product.getImage(),
            product.getStock(),
            product.getEcoFeatures()
        );
    }
}

