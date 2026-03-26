package com.CategoryApplication.category_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Category {

    @Id
    @Column(name="category_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;
    
    @Column(name="category_name")
    private String categoryName;
    
    @Column(name="category_description")
    private String categoryDescription;
}
