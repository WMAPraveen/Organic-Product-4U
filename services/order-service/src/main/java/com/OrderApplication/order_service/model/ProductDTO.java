package com.OrderApplication.order_service.model;

import lombok.Getter;
import lombok.Setter;

public class ProductDTO {

    @Getter @Setter
    private String productId;
    @Getter @Setter
    private String productName;
    @Getter @Setter
    private Double productPrice;
}
