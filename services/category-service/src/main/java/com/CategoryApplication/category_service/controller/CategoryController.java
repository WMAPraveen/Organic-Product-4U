package com.CategoryApplication.category_service.controller;

import com.CategoryApplication.category_service.model.CategoryDTO;
import com.CategoryApplication.category_service.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @PostMapping(value = "/api/addcategory")
    public CategoryDTO addCategory(@RequestBody CategoryDTO categoryDTO) {
        return categoryService.addCategory(categoryDTO);
    }

    @GetMapping(value = "/api/category/{categoryId}")
    public CategoryDTO getCategoryById(@PathVariable Integer categoryId) {
        return categoryService.getCategoryById(categoryId);
    }

    @GetMapping(value = "/api/categorylist")
    public ArrayList<CategoryDTO> getCategoryList() {
        return categoryService.getAllCategories();
    }

    @PutMapping(value = "/api/updatecategory")
    public CategoryDTO updateCategory(@RequestBody CategoryDTO categoryDTO) {
        return categoryService.updateCategory(categoryDTO);
    }

    @DeleteMapping(value = "/api/category/{categoryId}")
    public String deleteCategory(@PathVariable Integer categoryId) {
        return categoryService.deleteCategory(categoryId);
    }
}
