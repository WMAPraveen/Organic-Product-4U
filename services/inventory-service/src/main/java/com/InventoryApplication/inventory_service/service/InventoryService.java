package com.InventoryApplication.inventory_service.service;

import java.util.ArrayList;
import com.InventoryApplication.inventory_service.model.InventoryDTO;

public interface InventoryService {
    InventoryDTO addInventory(InventoryDTO inventoryDTO);
    InventoryDTO getInventoryById(Integer inventoryId);
    InventoryDTO getInventoryByProductId(String productId);
    ArrayList<InventoryDTO> getAllInventories();
    InventoryDTO updateInventory(InventoryDTO inventoryDTO);
    String deleteInventory(Integer inventoryId);
    boolean deductStock(String productId, int quantity);
}
