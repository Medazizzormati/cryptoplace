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
    
    List<Transaction> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Transaction> findByUserIdAndCryptoSymbolOrderByCreatedAtDesc(Long userId, String cryptoSymbol);
    
    List<Transaction> findByUserIdAndTransactionTypeOrderByCreatedAtDesc(Long userId, TransactionType transactionType);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.createdAt BETWEEN :startDate AND :endDate ORDER BY t.createdAt DESC")
    List<Transaction> findByUserIdAndDateRangeOrderByCreatedAtDesc(
        @Param("userId") Long userId, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(t.totalAmount) FROM Transaction t WHERE t.user.id = :userId AND t.transactionType = :transactionType")
    Double getTotalAmountByUserIdAndType(@Param("userId") Long userId, @Param("transactionType") TransactionType transactionType);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId ORDER BY t.createdAt DESC")
    List<Transaction> findRecentTransactionsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT t.cryptoSymbol FROM Transaction t WHERE t.user.id = :userId")
    List<String> findDistinctSymbolsByUserId(@Param("userId") Long userId);
} 