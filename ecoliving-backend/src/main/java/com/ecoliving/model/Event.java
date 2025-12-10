package com.ecoliving.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double discountPercentage;

    @ElementCollection
    @CollectionTable(name = "event_products", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "product_id")
    private List<Long> productIds;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private String icon;
}

