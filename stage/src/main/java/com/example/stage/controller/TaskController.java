// src/main/java/com/example/stage/controller/TaskController.java
package com.example.stage.controller;

import com.example.stage.dto.DashboardStats;
import com.example.stage.entity.Task;
import com.example.stage.services.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired private TaskService taskService;

    record TaskRequest(String title, String description, Boolean completed) {}

    @PostMapping
    public Task create(@AuthenticationPrincipal UserDetails user, @RequestBody TaskRequest rq) {
        return taskService.createTask(user.getUsername(), rq.title(), rq.description());
    }

    @GetMapping
    public List<Task> list(@AuthenticationPrincipal UserDetails user) {
        return taskService.listTasks(user.getUsername());
    }

    @PutMapping("/{id}")
    public Task update(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long id,
            @RequestBody TaskRequest rq
    ) {
        return taskService.updateTask(
                user.getUsername(),
                id,
                rq.title(),
                rq.description(),
                rq.completed()
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@AuthenticationPrincipal UserDetails user, @PathVariable Long id) {
        taskService.deleteTask(user.getUsername(), id);
    }

    /** NEW: Dashboard endpoint */
    @GetMapping("/dashboard")
    public DashboardStats dashboard(@AuthenticationPrincipal UserDetails user) {
        return taskService.getDashboardStats(user.getUsername());
    }
}
