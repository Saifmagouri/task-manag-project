// src/main/java/com/example/stage/controller/UserController.java
package com.example.stage.controller;

import com.example.stage.services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService users;
    public UserController(UserService users) { this.users = users; }

    @GetMapping("/me")
    public ResponseEntity<UserService.UserDto> me(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(users.getMe(principal.getUsername()));
    }

    public static class UpdateMeRequest { @NotBlank public String username; }

    @PutMapping("/me")
    public ResponseEntity<UserService.UserDto> updateMe(
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody @Valid UpdateMeRequest req) {
        return ResponseEntity.ok(users.updateUsername(principal.getUsername(), req.username));
    }

    public static class ChangePasswordRequest {
        @NotBlank public String currentPassword;
        @NotBlank public String newPassword;
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody @Valid ChangePasswordRequest req) {
        users.changePassword(principal.getUsername(), req.currentPassword, req.newPassword);
        return ResponseEntity.ok(Map.of("message", "Password changed"));
    }
}
