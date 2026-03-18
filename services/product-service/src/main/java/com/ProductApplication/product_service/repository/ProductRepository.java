package com.ProductApplication.product_service.repository;

import com.ProductApplication.product_service.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {

    List<Product>findByProductNameContainingIgnoreCase(String productName);

    List<Product> findByCategoryId(Integer categoryId);
}
