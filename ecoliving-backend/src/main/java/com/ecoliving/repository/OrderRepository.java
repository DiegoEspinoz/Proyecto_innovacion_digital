package com.ecoliving.repository;

import com.ecoliving.model.Order;
import com.ecoliving.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startDate")
    List<Order> findOrdersSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :startDate AND o.paymentMethod = :paymentMethod")
    List<Order> findOrdersByPaymentMethodSince(@Param("startDate") LocalDateTime startDate, @Param("paymentMethod") String paymentMethod);
}

