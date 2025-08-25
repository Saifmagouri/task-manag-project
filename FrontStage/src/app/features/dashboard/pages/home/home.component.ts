import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TasksService } from '../../../tasks/services/tasks.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
  ]
})
export class HomeComponent implements OnInit {
  private tasksService = inject(TasksService);

  stats = {
    total: 0,
    completed: 0,
    open: 0,
    rate: 0,
    newThisWeek: 0
  };

  ngOnInit(): void {
    this.tasksService.getDashboardStats().subscribe(data => {
      this.stats = data;
    });
  }
}
