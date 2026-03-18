package com.ProductApplication.product_service.service;

import java.util.ArrayList;

import com.ProductApplication.product_service.model.ProductDTO;

public interface ProductService {

    ArrayList<ProductDTO> getAllProductsByCategoryId(Integer categoryId);
}
