package com.ProductApplication.product_service.controller;

import com.ProductApplication.product_service.model.ProductDTO;
import com.ProductApplication.product_service.service.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class ProductController {

    @Autowired
    ProductServiceImpl productService;


    @PostMapping(value = "/api/addproduct")
    public ProductDTO addProduct(@ModelAttribute ProductDTO productDTO) {
        return productService.addProduct(productDTO);
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
    public ProductDTO updateProduct(@ModelAttribute ProductDTO productDTO) {
        return productService.updateProduct(productDTO);
    }

    @DeleteMapping(value = "/api/product/{productId}")
    public String deleteProduct(@PathVariable String productId) {
        return productService.deleteProduct(productId);
    }

    @GetMapping(value = "/api/productlist/{categoryId}")
    public ArrayList<ProductDTO> getProductlistByCategoryId(@PathVariable Integer categoryId){return productService.getAllProductsByCategoryId(categoryId);}
}
