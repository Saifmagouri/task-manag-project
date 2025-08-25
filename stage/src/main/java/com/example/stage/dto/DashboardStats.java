// src/main/java/com/example/stage/dto/DashboardStats.java
package com.example.stage.dto;

public class DashboardStats {
    private int total;
    private int completed;
    private int open;
    private int rate;
    private int newThisWeek;

    public DashboardStats(int total, int completed, int open, int rate, int newThisWeek) {
        this.total = total;
        this.completed = completed;
        this.open = open;
        this.rate = rate;
        this.newThisWeek = newThisWeek;
    }

    public int getTotal() { return total; }
    public int getCompleted() { return completed; }
    public int getOpen() { return open; }
    public int getRate() { return rate; }
    public int getNewThisWeek() { return newThisWeek; }
}
