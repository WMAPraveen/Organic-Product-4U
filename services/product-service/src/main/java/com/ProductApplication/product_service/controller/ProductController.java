package com.ProductApplication.product_service.controller;

import com.ProductApplication.product_service.model.ProductDTO;
import com.ProductApplication.product_service.service.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class ProductController {

    @Autowired
    ProductServiceImpl productService;


    public ResponseEntity<?> addProduct(
            @ModelAttribute ProductDTO productDTO,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only");
        }
        return ResponseEntity.ok(productService.addProduct(productDTO));
    }

    @GetMapping(value = "/api/product/{productId}")
    public ProductDTO getProductById(@PathVariable String productId) {
        return productService.getProductById(productId);
    }

    @GetMapping(value = "/api/productlist")
    public ArrayList<ProductDTO> getProductList() {
        return productService.getAllProducts();
    }

    @GetMapping(value = "/api/productsearch")
    public ArrayList<ProductDTO> searchProduct(@RequestParam String keyword) {
        return productService.searchProducts(keyword);
    }

    @PutMapping(value = "/api/updateproduct")
    public ResponseEntity<?> updateProduct(
            @ModelAttribute ProductDTO productDTO,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only");
        }
        return ResponseEntity.ok(productService.updateProduct(productDTO));
    }


    @DeleteMapping(value = "/api/deleteproduct/{productId}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable String productId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied — admin only");
        }
        return ResponseEntity.ok(productService.deleteProduct(productId));
    }

    @GetMapping(value = "/api/productlist/{categoryId}")
    public ArrayList<ProductDTO> getProductlistByCategoryId(@PathVariable Integer categoryId){return productService.getAllProductsByCategoryId(categoryId);}
}
