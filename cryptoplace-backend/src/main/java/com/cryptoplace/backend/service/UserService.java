package com.cryptoplace.backend.service;

import com.cryptoplace.backend.model.User;
import com.cryptoplace.backend.repository.UserRepository;
import com.cryptoplace.backend.repository.TransactionRepository;
import com.cryptoplace.backend.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> getUserProfile(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        Map<String, Object> profile = new HashMap<>();
        
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("firstName", user.getFirstName());
        profile.put("lastName", user.getLastName());
        profile.put("createdAt", user.getCreatedAt());
        profile.put("updatedAt", user.getUpdatedAt());
        profile.put("role", user.getRole());
        profile.put("isActive", true);
        
        return profile;
    }

    public User updateUserProfile(Long userId, Map<String, Object> request) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        
        if (request.containsKey("firstName")) {
            user.setFirstName((String) request.get("firstName"));
        }
        if (request.containsKey("lastName")) {
            user.setLastName((String) request.get("lastName"));
        }
        if (request.containsKey("email")) {
            String newEmail = (String) request.get("email");
            if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(newEmail);
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }

    public boolean changePassword(Long userId, String currentPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        return true;
    }

    public Map<String, Object> getUserStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Portfolio stats
        Long totalHoldings = portfolioRepository.countByUserId(userId);
        Double totalPortfolioValue = portfolioRepository.getTotalPortfolioValue(userId);
        
        // Transaction stats
        Long totalTransactions = transactionRepository.countByUserId(userId);
        
        stats.put("totalHoldings", totalHoldings != null ? totalHoldings : 0L);
        stats.put("totalPortfolioValue", totalPortfolioValue != null ? totalPortfolioValue : 0.0);
        stats.put("totalTransactions", totalTransactions != null ? totalTransactions : 0L);
        
        return stats;
    }

    public boolean deleteUserAccount(Long userId, String password) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return false;
        }
        
        // Delete user's portfolio and transactions
        portfolioRepository.deleteAll(portfolioRepository.findByUserId(userId));
        transactionRepository.deleteAll(transactionRepository.findByUserIdOrderByTimestampDesc(userId));
        
        // Delete user
        userRepository.delete(user);
        
        return true;
    }

    public Map<String, Object> getUserPreferences(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        
        Map<String, Object> preferences = new HashMap<>();
        
        // Default preferences
        preferences.put("currency", "USD");
        preferences.put("theme", "light");
        preferences.put("emailNotifications", true);
        preferences.put("priceAlerts", true);
        preferences.put("language", "en");
        
        return preferences;
    }

    public Map<String, Object> updateUserPreferences(Long userId, Map<String, Object> request) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found");
        }
        
        // In a real application, you would store preferences in a separate table
        // For now, we'll just return the updated preferences
        Map<String, Object> preferences = new HashMap<>();
        
        preferences.put("currency", request.getOrDefault("currency", "USD"));
        preferences.put("theme", request.getOrDefault("theme", "light"));
        preferences.put("emailNotifications", request.getOrDefault("emailNotifications", true));
        preferences.put("priceAlerts", request.getOrDefault("priceAlerts", true));
        preferences.put("language", request.getOrDefault("language", "en"));
        
        return preferences;
    }
} 