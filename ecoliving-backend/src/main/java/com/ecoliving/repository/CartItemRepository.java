package com.ecoliving.repository;

import com.ecoliving.model.CartItem;
import com.ecoliving.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, com.ecoliving.model.Product product);
    void deleteByUser(User user);
}
