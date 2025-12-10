package com.ecoliving.dto;

import lombok.Data;

@Data
public class CartItemDto {
    private Long id;
    private Long productId;
    private Integer quantity;
    private ProductDto product;
}
