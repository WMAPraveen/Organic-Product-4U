package com.ProductApplication.product_service.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductDTO {

    @Getter
    @Setter
    private String productId;
    @Getter @Setter
    private String productName;
    @Getter @Setter
    private String productDescription;
    @Getter @Setter
    private BigDecimal productPrice;
    @Getter @Setter
    private Integer categoryId;
    @Getter @Setter
    private List<MultipartFile> cardImages;
    @Getter @Setter
    private List<MultipartFile> detailImages;
    @Getter @Setter
    private List<String> cardImageUrls;
    @Getter @Setter
    private List<String> detailImageUrls;
    @Getter @Setter
    private LocalDateTime createdAt;
    @Getter @Setter
    private LocalDateTime updatedAt;
    @Getter @Setter
    private String categoryName;
    @Getter @Setter
    private String categoryDescription;
}
