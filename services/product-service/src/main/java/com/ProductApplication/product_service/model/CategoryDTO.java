package com.ProductApplication.product_service.model;

import lombok.Getter;
import lombok.Setter;

public class CategoryDTO {

    @Getter @Setter
    private Integer categoryId;
    @Getter @Setter
    private String categoryName;
    @Getter @Setter
    private String categoryDescription;
}
