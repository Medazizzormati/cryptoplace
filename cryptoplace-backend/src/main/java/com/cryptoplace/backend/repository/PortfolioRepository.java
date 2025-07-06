package com.cryptoplace.backend.repository;

import com.cryptoplace.backend.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    
    List<Portfolio> findByUserId(Long userId);
    
    Optional<Portfolio> findByUserIdAndSymbol(Long userId, String symbol);
    
    @Query("SELECT p FROM Portfolio p WHERE p.userId = :userId ORDER BY p.amount DESC")
    List<Portfolio> findByUserIdOrderByAmountDesc(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Portfolio p WHERE p.userId = :userId AND p.amount > 0")
    List<Portfolio> findActiveHoldingsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(p) FROM Portfolio p WHERE p.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(p.amount * p.averagePrice) FROM Portfolio p WHERE p.userId = :userId")
    Double getTotalPortfolioValue(@Param("userId") Long userId);
} 