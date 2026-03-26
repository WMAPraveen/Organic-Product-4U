package com.InventoryApplication.inventory_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Inventory {

    @Id
    @Column(name="inventory_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer inventoryId;
    
    @Column(name="product_id")
    private String productId;
    
    @Column(name="quantity")
    private Integer quantity;
}
