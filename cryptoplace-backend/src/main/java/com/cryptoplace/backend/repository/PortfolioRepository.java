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
    
    Optional<Portfolio> findByUserIdAndCryptoSymbol(Long userId, String cryptoSymbol);
    
    @Query("SELECT p FROM Portfolio p WHERE p.user.id = :userId ORDER BY p.quantity DESC")
    List<Portfolio> findByUserIdOrderByQuantityDesc(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Portfolio p WHERE p.user.id = :userId AND p.quantity > 0")
    List<Portfolio> findActiveHoldingsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(p) FROM Portfolio p WHERE p.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(p.quantity * p.averagePrice) FROM Portfolio p WHERE p.user.id = :userId")
    Double getTotalPortfolioValue(@Param("userId") Long userId);
} 