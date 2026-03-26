package com.OrderApplication.order_service.model;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

public class OrderDTO {

    @Getter @Setter
    private String orderId;
    @Getter @Setter
    private String userId;
    @Getter @Setter
    private BigDecimal orderTotal;
    @Getter @Setter
    private String status;
    @Getter @Setter
    private String productId;
    @Getter @Setter
    private Integer quantity;
}
