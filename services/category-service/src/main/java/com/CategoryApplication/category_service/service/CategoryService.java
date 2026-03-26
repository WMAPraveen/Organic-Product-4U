package com.CategoryApplication.category_service.service;

import java.util.ArrayList;
import com.CategoryApplication.category_service.model.CategoryDTO;

public interface CategoryService {
    CategoryDTO addCategory(CategoryDTO categoryDTO);
    CategoryDTO getCategoryById(Integer categoryId);
    ArrayList<CategoryDTO> getAllCategories();
    CategoryDTO updateCategory(CategoryDTO categoryDTO);
    String deleteCategory(Integer categoryId);
}
