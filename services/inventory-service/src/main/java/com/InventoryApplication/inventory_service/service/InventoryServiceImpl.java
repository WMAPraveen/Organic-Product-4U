package com.InventoryApplication.inventory_service.service;

import com.InventoryApplication.inventory_service.entity.Inventory;
import com.InventoryApplication.inventory_service.model.InventoryDTO;
import com.InventoryApplication.inventory_service.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    InventoryRepository inventoryRepository;

    @Override
    public InventoryDTO addInventory(InventoryDTO inventoryDTO) {
        System.out.println("Received request to add inventory for product: " + inventoryDTO.getProductId());
        Inventory inventory = convertInventoryDTOtoInventory(inventoryDTO);
        Inventory savedInventory = inventoryRepository.save(inventory);
        return convertInventorytoInventoryDTO(savedInventory);
    }

    @Override
    public InventoryDTO getInventoryById(Integer inventoryId) {
        return inventoryRepository.findById(inventoryId)
                .map(this::convertInventorytoInventoryDTO)
                .orElse(null);
    }

    @Override
    public InventoryDTO getInventoryByProductId(String productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId);
        if (inventory != null) {
            return convertInventorytoInventoryDTO(inventory);
        }
        return null;
    }

    @Override
    public ArrayList<InventoryDTO> getAllInventories() {
        List<Inventory> inventoryList = inventoryRepository.findAll();
        ArrayList<InventoryDTO> inventoryDTOList = new ArrayList<>();

        for (Inventory inventory : inventoryList) {
            inventoryDTOList.add(convertInventorytoInventoryDTO(inventory));
        }
        return inventoryDTOList;
    }

    @Override
    public InventoryDTO updateInventory(InventoryDTO inventoryDTO) {
        if (inventoryDTO.getInventoryId() == null) {
            throw new RuntimeException("Inventory ID is required for update.");
        }

        Optional<Inventory> inventoryOptional = inventoryRepository.findById(inventoryDTO.getInventoryId());

        if (inventoryOptional.isPresent()) {
            Inventory inventory = inventoryOptional.get();
            inventory.setProductId(inventoryDTO.getProductId());
            inventory.setQuantity(inventoryDTO.getQuantity());

            inventoryRepository.save(inventory);
            return convertInventorytoInventoryDTO(inventory);
        } else {
            throw new RuntimeException("Inventory not found with ID: " + inventoryDTO.getInventoryId());
        }
    }

    @Override
    public String deleteInventory(Integer inventoryId) {
        Optional<Inventory> inventoryOptional = inventoryRepository.findById(inventoryId);

        if (inventoryOptional.isPresent()) {
            Inventory inventory = inventoryOptional.get();
            String productId = inventory.getProductId();
            inventoryRepository.deleteById(inventoryId);
            return "Inventory for Product " + productId + " Deleted Successfully";
        }
        return "Inventory Not Found";
    }

    public InventoryDTO convertInventorytoInventoryDTO(Inventory inventory) {
        InventoryDTO inventoryDTO = new InventoryDTO();
        inventoryDTO.setInventoryId(inventory.getInventoryId());
        inventoryDTO.setProductId(inventory.getProductId());
        inventoryDTO.setQuantity(inventory.getQuantity());
        return inventoryDTO;
    }

    public Inventory convertInventoryDTOtoInventory(InventoryDTO inventoryDTO) {
        Inventory inventory = new Inventory();
        inventory.setProductId(inventoryDTO.getProductId());
        inventory.setQuantity(inventoryDTO.getQuantity());
        return inventory;
    }
}
