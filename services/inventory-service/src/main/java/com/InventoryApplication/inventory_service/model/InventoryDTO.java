package com.InventoryApplication.inventory_service.model;

import lombok.Getter;
import lombok.Setter;

public class InventoryDTO {

    @Getter @Setter
    private Integer inventoryId;
    @Getter @Setter
    private String productId;
    @Getter @Setter
    private Integer quantity;
}
