package com.CartApplication.cart_service.service;

import com.CartApplication.cart_service.entity.CartItem;
import com.CartApplication.cart_service.model.CartItemDTO;
import com.CartApplication.cart_service.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    @Override
    public CartItemDTO addToCart(CartItemDTO cartItemDTO) {
        // If the same product already exists in the user's cart, increase quantity
        Optional<CartItem> existing = cartRepository.findByUserIdAndProductId(
                cartItemDTO.getUserId(), cartItemDTO.getProductId());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + cartItemDTO.getQuantity());
            // Update product details in case they changed
            item.setProductName(cartItemDTO.getProductName());
            item.setProductPrice(cartItemDTO.getProductPrice());
            item.setImageUrl(cartItemDTO.getImageUrl());
            return mapToDTO(cartRepository.save(item));
        }

        CartItem cartItem = mapToEntity(cartItemDTO);
        return mapToDTO(cartRepository.save(cartItem));
    }

    @Override
    public List<CartItemDTO> getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CartItemDTO updateCartItem(String cartItemId, CartItemDTO cartItemDTO) {
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + cartItemId));

        if (cartItemDTO.getQuantity() != null && cartItemDTO.getQuantity() > 0) {
            cartItem.setQuantity(cartItemDTO.getQuantity());
        }

        return mapToDTO(cartRepository.save(cartItem));
    }

    @Override
    public void removeCartItem(String cartItemId) {
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + cartItemId));
        cartRepository.delete(cartItem);
    }

    @Override
    @Transactional
    public void clearCart(String userId) {
        cartRepository.deleteByUserId(userId);
    }

    // ── Mappers ──────────────────────────────────────────────────────────────

    private CartItem mapToEntity(CartItemDTO dto) {
        CartItem item = new CartItem();
        item.setUserId(dto.getUserId());
        item.setProductId(dto.getProductId());
        item.setProductName(dto.getProductName());
        item.setProductPrice(dto.getProductPrice());
        item.setImageUrl(dto.getImageUrl());
        item.setQuantity(dto.getQuantity());
        return item;
    }

    private CartItemDTO mapToDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setCartItemId(item.getCartItemId());
        dto.setUserId(item.getUserId());
        dto.setProductId(item.getProductId());
        dto.setProductName(item.getProductName());
        dto.setProductPrice(item.getProductPrice());
        dto.setImageUrl(item.getImageUrl());
        dto.setQuantity(item.getQuantity());
        return dto;
    }
}
