package com.example.stage.repository;

import com.example.stage.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserUsername(String username);

    long countByUserUsername(String username); // total tasks
    long countByUserUsernameAndCompletedTrue(String username); // completed tasks
    long countByUserUsernameAndCompletedFalse(String username); // open tasks
    long countByUserUsernameAndCreatedAtAfter(String username, LocalDate date); // new this week
}
