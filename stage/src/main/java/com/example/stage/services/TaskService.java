// src/main/java/com/example/stage/services/TaskService.java
package com.example.stage.services;

import com.example.stage.dto.DashboardStats;
import com.example.stage.entity.Task;
import com.example.stage.entity.User;
import com.example.stage.repository.TaskRepository;
import com.example.stage.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {
    @Autowired private TaskRepository taskRepo;
    @Autowired private UserRepository userRepo;

    public Task createTask(String username, String title, String description) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        Task t = new Task();
        t.setTitle(title);
        t.setDescription(description);
        t.setUser(user);
        return taskRepo.save(t);
    }

    public List<Task> listTasks(String username) {
        return taskRepo.findByUserUsername(username);
    }

    public Task updateTask(String username, Long taskId, String title, String description, Boolean completed) {
        Task t = taskRepo.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (!t.getUser().getUsername().equals(username)) {
            throw new SecurityException("Not allowed");
        }
        if (title != null)        t.setTitle(title);
        if (description != null)  t.setDescription(description);
        if (completed != null)    t.setCompleted(completed);
        return taskRepo.save(t);
    }

    public void deleteTask(String username, Long taskId) {
        Task t = taskRepo.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        if (!t.getUser().getUsername().equals(username)) {
            throw new SecurityException("Not allowed");
        }
        taskRepo.delete(t);
    }

    /** NEW: Return dashboard stats */
    public DashboardStats getDashboardStats(String username) {
        List<Task> tasks = listTasks(username);

        int total = tasks.size();
        int completed = (int) tasks.stream().filter(Task::isCompleted).count();
        int open = total - completed;

        int rate = total > 0 ? (int) ((completed * 100.0) / total) : 0;

        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        int newThisWeek = (int) tasks.stream()
                .filter(t -> t.getCreatedAt() != null && t.getCreatedAt().isAfter(oneWeekAgo))
                .count();

        return new DashboardStats(total, completed, open, rate, newThisWeek);
    }
}
