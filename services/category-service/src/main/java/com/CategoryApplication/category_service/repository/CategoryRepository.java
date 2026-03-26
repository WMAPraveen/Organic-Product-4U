package com.CategoryApplication.category_service.repository;

import com.CategoryApplication.category_service.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
