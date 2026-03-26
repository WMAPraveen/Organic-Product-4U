package com.OrderApplication.order_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Table(name="orders") // order is a reserved keyword in SQL
public class Order {

    @Id
    @Column(name="order_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private String orderId;
    
    @Column(name="user_id")
    private String userId;
    
    @Column(name="order_total")
    private BigDecimal orderTotal;
    
    @Column(name="status")
    private String status;
}
