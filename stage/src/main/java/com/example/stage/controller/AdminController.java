// src/main/java/com/example/stage/controller/AdminController.java
package com.example.stage.controller;

import com.example.stage.entity.Role;
import com.example.stage.entity.User;
import com.example.stage.services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // applies to all endpoints here
public class AdminController {

    private final UserService users;
    public AdminController(UserService users) { this.users = users; }

    // Lightweight DTO (do not return entity to avoid exposing password)
    public record UserDto(Long id, String username, String role) {
        static UserDto from(User u) { return new UserDto(u.getId(), u.getUsername(), u.getRole().name()); }
    }

    /** GET /api/admin/users — list all users */
    @GetMapping("/users")
    public List<UserDto> listAllUsers() {
        return users.findAllUsers().stream().map(UserDto::from).toList();
    }

    /** POST /api/admin/users — create a user (ADMIN or USER) */
    static class CreateUserReq {
        @NotBlank public String username;
        @NotBlank public String password;
        @NotNull  public Role role; // USER or ADMIN
    }

    @PostMapping("/users")
    public UserDto create(@RequestBody @Valid CreateUserReq req) {
        return UserDto.from(users.adminCreateUser(req.username, req.password, req.role));
    }

    /** DELETE /api/admin/users/{id} — delete user (guards in service) */
    @DeleteMapping("/users/{id}")
    public Map<String,String> delete(@PathVariable Long id,
                                     @AuthenticationPrincipal UserDetails me) {
        users.adminDeleteUser(id, me.getUsername()); // blocks self-delete & last-admin delete
        return Map.of("message", "Deleted");
    }
}
