package com.ecoliving.service;

import com.ecoliving.dto.ProductDto;
import com.ecoliving.model.CartItem;
import com.ecoliving.model.Product;
import com.ecoliving.model.User;
import com.ecoliving.repository.CartItemRepository;
import com.ecoliving.repository.ProductRepository;
import com.ecoliving.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<CartItemDto> getCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return cartItemRepository.findByUser(user).stream()
                .map(item -> new CartItemDto(
                    ProductDto.from(item.getProduct()),
                    item.getQuantity()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemDto addToCart(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProduct(user, product);
        
        CartItem cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
        }

        cartItem = cartItemRepository.save(cartItem);
        return new CartItemDto(ProductDto.from(cartItem.getProduct()), cartItem.getQuantity());
    }

    @Transactional
    public CartItemDto updateCartItem(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItem.setQuantity(quantity);
        cartItem = cartItemRepository.save(cartItem);
        return new CartItemDto(ProductDto.from(cartItem.getProduct()), cartItem.getQuantity());
    }

    @Transactional
    public void removeFromCart(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartItemRepository.deleteByUser(user);
    }

    public static class CartItemDto {
        public ProductDto product;
        public Integer quantity;

        public CartItemDto(ProductDto product, Integer quantity) {
            this.product = product;
            this.quantity = quantity;
        }
    }
}
