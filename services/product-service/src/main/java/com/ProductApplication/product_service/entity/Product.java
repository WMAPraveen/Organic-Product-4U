package com.ProductApplication.product_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
public class Product {

    @Id
    @Column(name="product_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private String productId;
    @Column(name="product_name")
    private String productName;
    @Column(name="product_description")
    private String productDescription;
    @Column(name="product_price")
    private BigDecimal productPrice;
    @Column(name="category_id")
    private Integer categoryId;

    @Convert(converter = StringListConverter.class)
    @Column(name="card_image_urls", length = 3000)
    private List<String> cardImageURLs;

    @Convert(converter = StringListConverter.class)
    @Column(name="detail_image_urls", length = 3000)
    private List<String> detailImageURLs;
}
