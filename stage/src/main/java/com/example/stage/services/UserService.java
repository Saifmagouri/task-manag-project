// src/main/java/com/example/stage/services/UserService.java
package com.example.stage.services;

import java.util.List;

import com.example.stage.entity.Role;
import com.example.stage.entity.User;
import com.example.stage.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder encoder;

    /** Registers a brand-new user with the default ROLE_USER. */
    public User register(String username, String rawPassword) {
        if (userRepo.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(encoder.encode(rawPassword));
        user.setRole(Role.USER);
        return userRepo.save(user);
    }

    /** ADMIN: fetch every user. */
    public List<User> findAllUsers() {
        return userRepo.findAll();
    }

    /** Spring Security auth. */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    // ---- Me / Profile ----
    // Small DTO so we never return the password
    public static final class UserDto {
        public Long id; public String username; public String role;
        public UserDto(Long id, String username, String role) {
            this.id = id; this.username = username; this.role = role;
        }
    }

    /** Who am I? */
    public UserDto getMe(String username) {
        User u = userRepo.findByUsername(username).orElseThrow();
        return new UserDto(u.getId(), u.getUsername(), u.getRole().name());
    }

    /** Update basic info (start with username; add more fields later) */
    public UserDto updateUsername(String currentUsername, String newUsername) {
        User u = userRepo.findByUsername(currentUsername).orElseThrow();
        if (!currentUsername.equals(newUsername) && userRepo.findByUsername(newUsername).isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }
        u.setUsername(newUsername);
        userRepo.save(u);
        return new UserDto(u.getId(), u.getUsername(), u.getRole().name());
    }

    /** Change password (checks current password, stores BCrypt of new password) */
    public void changePassword(String username, String currentRaw, String newRaw) {
        User u = userRepo.findByUsername(username).orElseThrow();
        if (!encoder.matches(currentRaw, u.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        u.setPassword(encoder.encode(newRaw));
        userRepo.save(u);
    }

    // ---- Admin helpers (add / delete) ----

    /** ADMIN: create a user with chosen role. */
    @Transactional
    public User adminCreateUser(String username, String rawPassword, Role role) {
        if (userRepo.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }
        User u = new User();
        u.setUsername(username);
        u.setPassword(encoder.encode(rawPassword));
        u.setRole(role == null ? Role.USER : role);
        return userRepo.save(u);
    }

    /** ADMIN: delete a user (cannot delete yourself or the last admin). */
    @Transactional
    public void adminDeleteUser(Long id, String actingUsername) {
        User target = userRepo.findById(id).orElseThrow();
        if (target.getUsername().equals(actingUsername)) {
            throw new AccessDeniedException("You cannot delete yourself");
        }
        if (target.getRole() == Role.ADMIN && userRepo.countByRole(Role.ADMIN) <= 1) {
            throw new AccessDeniedException("Cannot delete the last admin");
        }
        userRepo.delete(target);
    }
}
