package com.PaymentApplication.payment_service.model;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private Long amount; // in cents
    private String currency = "usd";
    private String description = "Organic Products Order";
}
