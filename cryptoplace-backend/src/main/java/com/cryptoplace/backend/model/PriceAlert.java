package com.cryptoplace.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_alerts")
public class PriceAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @NotBlank
    @Column(name = "crypto_symbol", nullable = false)
    private String cryptoSymbol;

    @NotBlank
    @Column(name = "crypto_name", nullable = false)
    private String cryptoName;

    @NotNull
    @Positive
    @Column(name = "target_price", nullable = false, precision = 18, scale = 8)
    private BigDecimal targetPrice;

    @Column(name = "current_price", precision = 18, scale = 8)
    private BigDecimal currentPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "alert_type", nullable = false)
    private AlertType alertType;

    @Column(name = "message")
    private String message;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "is_triggered")
    private boolean isTriggered = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt;

    // Constructors
    public PriceAlert() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public PriceAlert(User user, String cryptoSymbol, String cryptoName, 
                     BigDecimal targetPrice, AlertType alertType) {
        this();
        this.user = user;
        this.cryptoSymbol = cryptoSymbol;
        this.cryptoName = cryptoName;
        this.targetPrice = targetPrice;
        this.alertType = alertType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCryptoSymbol() {
        return cryptoSymbol;
    }

    public void setCryptoSymbol(String cryptoSymbol) {
        this.cryptoSymbol = cryptoSymbol;
    }

    public String getCryptoName() {
        return cryptoName;
    }

    public void setCryptoName(String cryptoName) {
        this.cryptoName = cryptoName;
    }

    public BigDecimal getTargetPrice() {
        return targetPrice;
    }

    public void setTargetPrice(BigDecimal targetPrice) {
        this.targetPrice = targetPrice;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public AlertType getAlertType() {
        return alertType;
    }

    public void setAlertType(AlertType alertType) {
        this.alertType = alertType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isTriggered() {
        return isTriggered;
    }

    public void setTriggered(boolean triggered) {
        isTriggered = triggered;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getTriggeredAt() {
        return triggeredAt;
    }

    public void setTriggeredAt(LocalDateTime triggeredAt) {
        this.triggeredAt = triggeredAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Business methods
    public boolean checkAlert(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
        
        boolean shouldTrigger = false;
        
        switch (alertType) {
            case PRICE_ABOVE:
                shouldTrigger = currentPrice.compareTo(targetPrice) >= 0;
                break;
            case PRICE_BELOW:
                shouldTrigger = currentPrice.compareTo(targetPrice) <= 0;
                break;
            case PRICE_CHANGE_PERCENT:
                // Logic for percentage change alerts
                break;
        }
        
        if (shouldTrigger && !isTriggered) {
            this.isTriggered = true;
            this.triggeredAt = LocalDateTime.now();
            this.isActive = false;
            return true;
        }
        
        return false;
    }
} 