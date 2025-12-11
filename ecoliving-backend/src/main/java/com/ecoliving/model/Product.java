package com.ecoliving.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "eco_features_group_id")
    private Long ecoFeaturesGroupId;

    @Transient
    private List<String> ecoFeatures; // Maintained for DTO compatibility but not persisted directly in this table
}
