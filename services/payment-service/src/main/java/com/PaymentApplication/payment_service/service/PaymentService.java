package com.PaymentApplication.payment_service.service;

import com.PaymentApplication.payment_service.model.PaymentRequestDTO;
import com.PaymentApplication.payment_service.model.PaymentResponseDTO;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String secretKey;

    // This runs after the service is initialized to set the Stripe key
    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public PaymentResponseDTO createCheckoutSession(PaymentRequestDTO request) throws StripeException {
        
        System.out.println("=== Payment Request Received ===");
        System.out.println("Amount (smallest unit): " + request.getAmount());
        System.out.println("Currency: " + request.getCurrency());
        System.out.println("Description: " + request.getDescription());

        // Define what the user is buying
        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(request.getDescription())
                        .build();

        // Define the price
        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(request.getCurrency() != null ? request.getCurrency() : "inr")
                        .setUnitAmount(request.getAmount()) // Amount in paisa (e.g., 50000 = ₹500.00)
                        .setProductData(productData)
                        .build();

        // Create the line item
        SessionCreateParams.LineItem lineItem =
                SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(priceData)
                        .build();

        // Create the Checkout Session
        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}")
                        .setCancelUrl("http://localhost:5173/cart")
                        .addLineItem(lineItem)
                        .build();

        Session session = Session.create(params);

        System.out.println("Stripe Session created: " + session.getId());
        return new PaymentResponseDTO(session.getId(), session.getUrl());
    }
}
