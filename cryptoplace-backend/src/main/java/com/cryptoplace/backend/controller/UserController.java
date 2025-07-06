package com.cryptoplace.backend.controller;

import com.cryptoplace.backend.model.User;
import com.cryptoplace.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "User", description = "User management API")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Retrieve current user's profile information")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Map<String, Object> profile = userService.getUserProfile(user.getId());
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve profile", "message", e.getMessage()));
        }
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Update current user's profile information")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUserProfile(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            User updatedUser = userService.updateUserProfile(user.getId(), request);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "user", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update profile", "message", e.getMessage()));
        }
    }

    @PutMapping("/password")
    @Operation(summary = "Change password", description = "Change current user's password")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            String currentPassword = (String) request.get("currentPassword");
            String newPassword = (String) request.get("newPassword");
            
            boolean success = userService.changePassword(user.getId(), currentPassword, newPassword);
            
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to change password", "message", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @Operation(summary = "Get user statistics", description = "Get current user's statistics")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserStats(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Map<String, Object> stats = userService.getUserStats(user.getId());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve statistics", "message", e.getMessage()));
        }
    }

    @DeleteMapping("/account")
    @Operation(summary = "Delete user account", description = "Delete current user's account")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteUserAccount(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            String password = (String) request.get("password");
            
            boolean success = userService.deleteUserAccount(user.getId(), password);
            
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is incorrect"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete account", "message", e.getMessage()));
        }
    }

    @GetMapping("/preferences")
    @Operation(summary = "Get user preferences", description = "Get current user's preferences")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserPreferences(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Map<String, Object> preferences = userService.getUserPreferences(user.getId());
            return ResponseEntity.ok(preferences);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve preferences", "message", e.getMessage()));
        }
    }

    @PutMapping("/preferences")
    @Operation(summary = "Update user preferences", description = "Update current user's preferences")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUserPreferences(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Map<String, Object> preferences = userService.updateUserPreferences(user.getId(), request);
            return ResponseEntity.ok(Map.of("message", "Preferences updated successfully", "preferences", preferences));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update preferences", "message", e.getMessage()));
        }
    }
} 