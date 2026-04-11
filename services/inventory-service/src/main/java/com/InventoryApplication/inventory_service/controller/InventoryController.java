package com.InventoryApplication.inventory_service.controller;

import com.InventoryApplication.inventory_service.model.InventoryDTO;
import com.InventoryApplication.inventory_service.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class InventoryController {

    @Autowired
    InventoryService inventoryService;

    @PostMapping(value = "/api/addinventory")
    public ResponseEntity<?> addInventory(
            @RequestBody InventoryDTO inventoryDTO,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only");
        }
        return ResponseEntity.ok(inventoryService.addInventory(inventoryDTO));
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
    public ResponseEntity<?> updateInventory(
            @RequestBody InventoryDTO inventoryDTO,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only");
        }
        return ResponseEntity.ok(inventoryService.updateInventory(inventoryDTO));
    }

    @DeleteMapping(value = "/api/deleteinventory/{inventoryId}")
    public ResponseEntity<?> deleteInventory(
            @PathVariable Integer inventoryId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only");
        }
        return ResponseEntity.ok(inventoryService.deleteInventory(inventoryId));
    }


    @PutMapping("/api/inventory/deduct/{productId}")
    public ResponseEntity<String> deductStock(
            @PathVariable String productId,
            @RequestParam int quantity) {
        boolean success = inventoryService.deductStock(productId, quantity);
        if (success) {
            return ResponseEntity.ok("Stock deducted");
        }
        return ResponseEntity.badRequest().body("Insufficient stock");
    }

}