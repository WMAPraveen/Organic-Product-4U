package com.CategoryApplication.category_service.service;

import com.CategoryApplication.category_service.entity.Category;
import com.CategoryApplication.category_service.model.CategoryDTO;
import com.CategoryApplication.category_service.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    @Override
    public CategoryDTO addCategory(CategoryDTO categoryDTO) {
        System.out.println("Received request to add category: " + categoryDTO.getCategoryName());
        Category category = convertCategoryDTOtoCategory(categoryDTO);
        Category savedCategory = categoryRepository.save(category);
        return convertCategorytoCategoryDTO(savedCategory);
    }

    @Override
    public CategoryDTO getCategoryById(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .map(this::convertCategorytoCategoryDTO)
                .orElse(null);
    }

    @Override
    public ArrayList<CategoryDTO> getAllCategories() {
        List<Category> categoryList = categoryRepository.findAll();
        ArrayList<CategoryDTO> categoryDTOList = new ArrayList<>();

        for (Category category : categoryList) {
            categoryDTOList.add(convertCategorytoCategoryDTO(category));
        }
        return categoryDTOList;
    }

    @Override
    public CategoryDTO updateCategory(CategoryDTO categoryDTO) {
        if (categoryDTO.getCategoryId() == null) {
            throw new RuntimeException("Category ID is required for update.");
        }

        Optional<Category> categoryOptional = categoryRepository.findById(categoryDTO.getCategoryId());

        if (categoryOptional.isPresent()) {
            Category category = categoryOptional.get();
            category.setCategoryName(categoryDTO.getCategoryName());
            category.setCategoryDescription(categoryDTO.getCategoryDescription());

            categoryRepository.save(category);
            return convertCategorytoCategoryDTO(category);
        } else {
            throw new RuntimeException("Category not found with ID: " + categoryDTO.getCategoryId());
        }
    }

    @Override
    public String deleteCategory(Integer categoryId) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);

        if (categoryOptional.isPresent()) {
            Category category = categoryOptional.get();
            String categoryName = category.getCategoryName();
            categoryRepository.deleteById(categoryId);
            return categoryName + " Deleted Successfully";
        }
        return "Category Not Found";
    }

    public CategoryDTO convertCategorytoCategoryDTO(Category category) {
        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setCategoryId(category.getCategoryId());
        categoryDTO.setCategoryName(category.getCategoryName());
        categoryDTO.setCategoryDescription(category.getCategoryDescription());
        return categoryDTO;
    }

    public Category convertCategoryDTOtoCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setCategoryName(categoryDTO.getCategoryName());
        category.setCategoryDescription(categoryDTO.getCategoryDescription());
        return category;
    }
}
