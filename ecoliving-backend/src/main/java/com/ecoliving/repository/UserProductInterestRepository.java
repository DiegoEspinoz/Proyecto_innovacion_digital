package com.ecoliving.repository;

import com.ecoliving.model.User;
import com.ecoliving.model.UserProductInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProductInterestRepository extends JpaRepository<UserProductInterest, Long> {
    @Query("SELECT upi.product.id FROM UserProductInterest upi WHERE upi.user.id = :userId ORDER BY upi.clickedAt DESC")
    List<Long> findRecentProductIdsByUserId(@Param("userId") Long userId);
    
    boolean existsByUserAndProduct(User user, com.ecoliving.model.Product product);
}

