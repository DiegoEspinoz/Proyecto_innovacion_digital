package com.ecoliving.dto;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private List<OrderItemRequest> items;
    private String paymentMethod;
    private ShippingAddressDto shippingAddress;
}

