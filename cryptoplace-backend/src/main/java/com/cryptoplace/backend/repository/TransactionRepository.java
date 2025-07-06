package com.cryptoplace.backend.repository;

import com.cryptoplace.backend.model.Transaction;
import com.cryptoplace.backend.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByUserIdOrderByTimestampDesc(Long userId);
    
    List<Transaction> findByUserIdAndSymbolOrderByTimestampDesc(Long userId, String symbol);
    
    List<Transaction> findByUserIdAndTypeOrderByTimestampDesc(Long userId, TransactionType type);
    
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND t.timestamp BETWEEN :startDate AND :endDate ORDER BY t.timestamp DESC")
    List<Transaction> findByUserIdAndDateRangeOrderByTimestampDesc(
        @Param("userId") Long userId, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(t.amount * t.price) FROM Transaction t WHERE t.userId = :userId AND t.type = :type")
    Double getTotalAmountByUserIdAndType(@Param("userId") Long userId, @Param("type") TransactionType type);
    
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId ORDER BY t.timestamp DESC")
    List<Transaction> findRecentTransactionsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT t.symbol FROM Transaction t WHERE t.userId = :userId")
    List<String> findDistinctSymbolsByUserId(@Param("userId") Long userId);
} 