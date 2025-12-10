package com.ecoliving.dto;

import lombok.Data;

@Data
public class ShippingAddressDto {
    private String name;
    private String street;
    private String avenue;
    private String city;
    private String postalCode;
    private String phone;
}

