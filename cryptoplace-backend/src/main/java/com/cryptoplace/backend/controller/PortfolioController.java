package com.cryptoplace.backend.controller;

import com.cryptoplace.backend.model.Portfolio;
import com.cryptoplace.backend.model.Transaction;
import com.cryptoplace.backend.model.User;
import com.cryptoplace.backend.service.PortfolioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Portfolio", description = "User portfolio management API")
@SecurityRequirement(name = "Bearer Authentication")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping
    @Operation(summary = "Get user portfolio", description = "Retrieve current user's portfolio")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserPortfolio(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<Portfolio> portfolio = portfolioService.getPortfolioByUserId(user.getId());
            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve portfolio", "message", e.getMessage()));
        }
    }

    @GetMapping("/summary")
    @Operation(summary = "Get portfolio summary", description = "Get portfolio summary with total value and performance")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getPortfolioSummary(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Map<String, Object> summary = portfolioService.getPortfolioSummary(user.getId());
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve portfolio summary", "message", e.getMessage()));
        }
    }

    @GetMapping("/transactions")
    @Operation(summary = "Get user transactions", description = "Retrieve user's transaction history")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserTransactions(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<Transaction> transactions = portfolioService.getTransactionsByUserId(user.getId());
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve transactions", "message", e.getMessage()));
        }
    }

    @PostMapping("/buy")
    @Operation(summary = "Buy cryptocurrency", description = "Execute a buy transaction")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> buyCryptocurrency(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            String symbol = (String) request.get("symbol");
            Double amount = Double.valueOf(request.get("amount").toString());
            Double price = Double.valueOf(request.get("price").toString());
            
            Transaction transaction = portfolioService.buyCryptocurrency(user.getId(), symbol, amount, price);
            return ResponseEntity.ok(Map.of("message", "Purchase successful", "transaction", transaction));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to execute purchase", "message", e.getMessage()));
        }
    }

    @PostMapping("/sell")
    @Operation(summary = "Sell cryptocurrency", description = "Execute a sell transaction")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> sellCryptocurrency(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            String symbol = (String) request.get("symbol");
            Double amount = Double.valueOf(request.get("amount").toString());
            Double price = Double.valueOf(request.get("price").toString());
            
            Transaction transaction = portfolioService.sellCryptocurrency(user.getId(), symbol, amount, price);
            return ResponseEntity.ok(Map.of("message", "Sale successful", "transaction", transaction));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to execute sale", "message", e.getMessage()));
        }
    }

    @GetMapping("/performance")
    @Operation(summary = "Get portfolio performance", description = "Get portfolio performance metrics")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getPortfolioPerformance(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Map<String, Object> performance = portfolioService.getPortfolioPerformance(user.getId());
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve performance data", "message", e.getMessage()));
        }
    }

    @GetMapping("/holdings/{symbol}")
    @Operation(summary = "Get specific holding", description = "Get details of a specific cryptocurrency holding")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getHolding(
            @PathVariable String symbol,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Portfolio holding = portfolioService.getHoldingBySymbol(user.getId(), symbol);
            return ResponseEntity.ok(holding);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve holding", "message", e.getMessage()));
        }
    }
} 