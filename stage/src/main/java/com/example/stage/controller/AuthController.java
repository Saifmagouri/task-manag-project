package com.example.stage.controller;

import com.example.stage.services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired private AuthenticationManager authManager;

    static class SignupRequest { @NotBlank public String username; @NotBlank public String password; }
    static class LoginRequest  { @NotBlank
    public String username; @NotBlank public String password; }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SignupRequest req) {
        userService.register(req.username, req.password); // ensure you BCrypt here
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // AuthController
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest req) {
        try {
            var auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.username, req.password));
            var role = auth.getAuthorities().stream()
                    .findFirst().map(a -> a.getAuthority().replace("ROLE_","")).orElse("USER");
            return ResponseEntity.ok(Map.of("token","dev-token","role",role,"email",req.username));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
        }
    }



    // Optional: GET /api/auth/me for "who am I?"
    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal org.springframework.security.core.userdetails.User user) {
        var roles = user.getAuthorities().stream().map(a -> a.getAuthority()).toList();
        return ResponseEntity.ok(Map.of("username", user.getUsername(), "roles", roles));
    }
}
