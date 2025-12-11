package com.ecoliving.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_features")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductEcoFeatures {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // This is the "id" the user refers to, shared by 3 features of a single product
    // context
    @Column(nullable = false)
    private Long sharedId;

    @Column(nullable = false)
    private String feature;
}
