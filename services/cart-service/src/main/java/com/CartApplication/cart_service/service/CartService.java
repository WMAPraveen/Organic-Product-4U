package com.CartApplication.cart_service.service;

import com.CartApplication.cart_service.model.CartItemDTO;

import java.util.List;

public interface CartService {

    CartItemDTO addToCart(CartItemDTO cartItemDTO);

    List<CartItemDTO> getCartByUserId(String userId);

    CartItemDTO updateCartItem(String cartItemId, CartItemDTO cartItemDTO);

    void removeCartItem(String cartItemId);

    void clearCart(String userId);
}
