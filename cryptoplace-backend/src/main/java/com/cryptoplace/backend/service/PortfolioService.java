package com.cryptoplace.backend.service;

import com.cryptoplace.backend.model.Portfolio;
import com.cryptoplace.backend.model.Transaction;
import com.cryptoplace.backend.model.TransactionType;
import com.cryptoplace.backend.model.TransactionStatus;
import com.cryptoplace.backend.repository.PortfolioRepository;
import com.cryptoplace.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Portfolio> getPortfolioByUserId(Long userId) {
        return portfolioRepository.findByUserId(userId);
    }

    public Map<String, Object> getPortfolioSummary(Long userId) {
        List<Portfolio> holdings = portfolioRepository.findByUserId(userId);
        Map<String, Object> summary = new HashMap<>();
        
        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        int totalHoldings = holdings.size();
        
        for (Portfolio holding : holdings) {
            BigDecimal currentValue = holding.getAmount().multiply(holding.getAveragePrice());
            totalValue = totalValue.add(currentValue);
            totalCost = totalCost.add(holding.getAmount().multiply(holding.getAveragePrice()));
        }
        
        BigDecimal profit = totalValue.subtract(totalCost);
        BigDecimal profitPercentage = totalCost.compareTo(BigDecimal.ZERO) > 0 ? 
            profit.divide(totalCost, 4, BigDecimal.ROUND_HALF_UP).multiply(BigDecimal.valueOf(100)) : 
            BigDecimal.ZERO;
        
        summary.put("totalValue", totalValue);
        summary.put("totalCost", totalCost);
        summary.put("totalProfit", profit);
        summary.put("profitPercentage", profitPercentage);
        summary.put("totalHoldings", totalHoldings);
        
        return summary;
    }

    public List<Transaction> getTransactionsByUserId(Long userId) {
        return transactionRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public Transaction buyCryptocurrency(Long userId, String symbol, Double amount, Double price) {
        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setSymbol(symbol);
        transaction.setAmount(BigDecimal.valueOf(amount));
        transaction.setPrice(BigDecimal.valueOf(price));
        transaction.setType(TransactionType.BUY);
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setTimestamp(LocalDateTime.now());
        
        transaction = transactionRepository.save(transaction);
        
        // Update portfolio
        updatePortfolioAfterBuy(userId, symbol, amount, price);
        
        return transaction;
    }

    public Transaction sellCryptocurrency(Long userId, String symbol, Double amount, Double price) {
        // Check if user has enough balance
        Portfolio holding = portfolioRepository.findByUserIdAndSymbol(userId, symbol).orElse(null);
        if (holding == null || holding.getAmount().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new RuntimeException("Insufficient balance for " + symbol);
        }
        
        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setSymbol(symbol);
        transaction.setAmount(BigDecimal.valueOf(amount));
        transaction.setPrice(BigDecimal.valueOf(price));
        transaction.setType(TransactionType.SELL);
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setTimestamp(LocalDateTime.now());
        
        transaction = transactionRepository.save(transaction);
        
        // Update portfolio
        updatePortfolioAfterSell(userId, symbol, amount, price);
        
        return transaction;
    }

    private void updatePortfolioAfterBuy(Long userId, String symbol, Double amount, Double price) {
        Portfolio holding = portfolioRepository.findByUserIdAndSymbol(userId, symbol).orElse(null);
        
        if (holding == null) {
            // Create new holding
            holding = new Portfolio();
            holding.setUserId(userId);
            holding.setSymbol(symbol);
            holding.setAmount(BigDecimal.valueOf(amount));
            holding.setAveragePrice(BigDecimal.valueOf(price));
            holding.setLastUpdated(LocalDateTime.now());
        } else {
            // Update existing holding
            BigDecimal totalCost = holding.getAmount().multiply(holding.getAveragePrice())
                .add(BigDecimal.valueOf(amount).multiply(BigDecimal.valueOf(price)));
            BigDecimal totalAmount = holding.getAmount().add(BigDecimal.valueOf(amount));
            
            holding.setAveragePrice(totalCost.divide(totalAmount, 8, BigDecimal.ROUND_HALF_UP));
            holding.setAmount(totalAmount);
            holding.setLastUpdated(LocalDateTime.now());
        }
        
        portfolioRepository.save(holding);
    }

    private void updatePortfolioAfterSell(Long userId, String symbol, Double amount, Double price) {
        Portfolio holding = portfolioRepository.findByUserIdAndSymbol(userId, symbol).orElse(null);
        
        if (holding != null) {
            BigDecimal newAmount = holding.getAmount().subtract(BigDecimal.valueOf(amount));
            
            if (newAmount.compareTo(BigDecimal.ZERO) <= 0) {
                // Remove holding if amount becomes zero or negative
                portfolioRepository.delete(holding);
            } else {
                // Update amount
                holding.setAmount(newAmount);
                holding.setLastUpdated(LocalDateTime.now());
                portfolioRepository.save(holding);
            }
        }
    }

    public Map<String, Object> getPortfolioPerformance(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByTimestampDesc(userId);
        Map<String, Object> performance = new HashMap<>();
        
        BigDecimal totalInvested = BigDecimal.ZERO;
        BigDecimal totalReturns = BigDecimal.ZERO;
        
        for (Transaction transaction : transactions) {
            if (transaction.getType() == TransactionType.BUY) {
                totalInvested = totalInvested.add(transaction.getAmount().multiply(transaction.getPrice()));
            } else if (transaction.getType() == TransactionType.SELL) {
                totalReturns = totalReturns.add(transaction.getAmount().multiply(transaction.getPrice()));
            }
        }
        
        performance.put("totalInvested", totalInvested);
        performance.put("totalReturns", totalReturns);
        performance.put("totalTransactions", transactions.size());
        
        return performance;
    }

    public Portfolio getHoldingBySymbol(Long userId, String symbol) {
        return portfolioRepository.findByUserIdAndSymbol(userId, symbol).orElse(null);
    }
} 