package com.InventoryApplication.inventory_service.controller;

import com.InventoryApplication.inventory_service.model.InventoryDTO;
import com.InventoryApplication.inventory_service.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class InventoryController {

    @Autowired
    InventoryService inventoryService;

    @PostMapping(value = "/api/addinventory")
    public InventoryDTO addInventory(@RequestBody InventoryDTO inventoryDTO) {
        return inventoryService.addInventory(inventoryDTO);
    }

    @GetMapping(value = "/api/inventory/{inventoryId}")
    public InventoryDTO getInventoryById(@PathVariable Integer inventoryId) {
        return inventoryService.getInventoryById(inventoryId);
    }

    @GetMapping(value = "/api/inventory/product/{productId}")
    public InventoryDTO getInventoryByProductId(@PathVariable String productId) {
        return inventoryService.getInventoryByProductId(productId);
    }

    @GetMapping(value = "/api/inventorylist")
    public ArrayList<InventoryDTO> getInventoryList() {
        return inventoryService.getAllInventories();
    }

    @PutMapping(value = "/api/updateinventory")
    public InventoryDTO updateInventory(@RequestBody InventoryDTO inventoryDTO) {
        return inventoryService.updateInventory(inventoryDTO);
    }

    @DeleteMapping(value = "/api/deleteinventory/{inventoryId}")
    public String deleteInventory(@PathVariable Integer inventoryId) {
        return inventoryService.deleteInventory(inventoryId);
    }
}
