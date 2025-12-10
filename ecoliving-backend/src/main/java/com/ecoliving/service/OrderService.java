package com.ecoliving.service;

import com.ecoliving.dto.OrderRequest;
import com.ecoliving.model.*;
import com.ecoliving.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order createOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(Order.OrderStatus.COMPLETED);
        order.setCustomerName(user.getName());
        order.setCustomerEmail(user.getEmail());

        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (var itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.getQuantity());
            item.setPriceAtPurchase(product.getPrice());
            items.add(item);

            total += product.getPrice() * itemRequest.getQuantity();

            // Update stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        order.setItems(items);
        order.setTotal(total);

        // Save shipping address
        if (request.getShippingAddress() != null) {
            ShippingAddress shippingAddress = new ShippingAddress();
            shippingAddress.setOrder(order);
            shippingAddress.setName(request.getShippingAddress().getName());
            shippingAddress.setStreet(request.getShippingAddress().getStreet());
            shippingAddress.setAvenue(request.getShippingAddress().getAvenue());
            shippingAddress.setCity(request.getShippingAddress().getCity());
            shippingAddress.setPostalCode(request.getShippingAddress().getPostalCode());
            shippingAddress.setPhone(request.getShippingAddress().getPhone());
            order.setShippingAddress(shippingAddress);
        }

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
