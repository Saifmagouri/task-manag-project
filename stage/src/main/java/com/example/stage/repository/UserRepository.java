// src/main/java/com/example/stage/repository/UserRepository.java
package com.example.stage.repository;

import com.example.stage.entity.Role;
import com.example.stage.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);   // optional, not required above but handy
    long countByRole(Role role);                 // used to block deleting the last admin
}
