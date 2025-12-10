package com.ecoliving.service;

import com.ecoliving.model.Order;
import com.ecoliving.model.Product;
import com.ecoliving.repository.OrderRepository;
import com.ecoliving.repository.ProductRepository;
import com.ecoliving.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getStats() {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7);
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);

        List<Order> monthlyOrders = orderRepository.findOrdersSince(monthStart);
        List<Order> weeklyOrders = orderRepository.findOrdersSince(weekStart);
        List<Order> dailyOrders = orderRepository.findOrdersSince(todayStart);

        return Map.of(
            "daily", dailyOrders.stream().mapToDouble(Order::getTotal).sum(),
            "weekly", weeklyOrders.stream().mapToDouble(Order::getTotal).sum(),
            "monthly", monthlyOrders.stream().mapToDouble(Order::getTotal).sum(),
            "totalOrders", orderRepository.count(),
            "totalRevenue", orderRepository.findAll().stream().mapToDouble(Order::getTotal).sum(),
            "totalCustomers", userRepository.count(),
            "totalProducts", productRepository.count(),
            "lowStock", productRepository.findAll().stream().mapToLong(p -> p.getStock() < 20 ? 1 : 0).sum()
        );
    }

    public List<Map<String, Object>> getSalesByCategory() {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        List<Order> monthlyOrders = orderRepository.findOrdersSince(monthStart);

        Map<String, Map<String, Object>> categoryData = new HashMap<>();

        monthlyOrders.forEach(order -> {
            order.getItems().forEach(item -> {
                String category = item.getProduct().getCategory();
                categoryData.putIfAbsent(category, new HashMap<>(Map.of("quantity", 0, "revenue", 0.0)));
                
                Map<String, Object> data = categoryData.get(category);
                data.put("quantity", (Integer) data.get("quantity") + item.getQuantity());
                data.put("revenue", (Double) data.get("revenue") + (item.getPriceAtPurchase() * item.getQuantity()));
            });
        });

        return categoryData.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> result = new HashMap<>(entry.getValue());
                    result.put("name", entry.getKey());
                    return result;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("revenue"), (Double) a.get("revenue")))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTopProducts() {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        List<Order> monthlyOrders = orderRepository.findOrdersSince(monthStart);

        Map<Long, Map<String, Object>> productData = new HashMap<>();

        monthlyOrders.forEach(order -> {
            order.getItems().forEach(item -> {
                Long productId = item.getProduct().getId();
                productData.putIfAbsent(productId, new HashMap<>(Map.of(
                    "product", item.getProduct(),
                    "quantity", 0,
                    "revenue", 0.0
                )));
                
                Map<String, Object> data = productData.get(productId);
                data.put("quantity", (Integer) data.get("quantity") + item.getQuantity());
                data.put("revenue", (Double) data.get("revenue") + (item.getPriceAtPurchase() * item.getQuantity()));
            });
        });

        return productData.values().stream()
                .sorted((a, b) -> Double.compare((Double) b.get("revenue"), (Double) a.get("revenue")))
                .limit(5)
                .collect(Collectors.toList());
    }

    public Map<String, Double> getSalesByPaymentMethod() {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        
        List<Order> yapeOrders = orderRepository.findOrdersByPaymentMethodSince(monthStart, "yape");
        List<Order> cardOrders = orderRepository.findOrdersByPaymentMethodSince(monthStart, "card");
        
        double yapeTotal = yapeOrders.stream().mapToDouble(Order::getTotal).sum();
        double tarjetaTotal = cardOrders.stream().mapToDouble(Order::getTotal).sum();

        return Map.of("yape", yapeTotal, "tarjeta", tarjetaTotal);
    }
}

