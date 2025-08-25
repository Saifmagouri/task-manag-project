import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task'; // <-- shared model

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private http: HttpClient) {}

  list(): Observable<Task[]> {
    return this.http.get<Task[]>('/api/tasks');
  }

  add(title: string, description = ''): Observable<Task> {
    return this.http.post<Task>('/api/tasks', { title, description });
  }

  update(id: number, data: Partial<Pick<Task, 'title' | 'description' | 'completed'>>): Observable<Task> {
    return this.http.put<Task>(`/api/tasks/${id}`, data);
  }

  toggle(id: number, completed: boolean): Observable<Task> {
    return this.update(id, { completed });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`/api/tasks/${id}`);
  }

  // 👇 Add this new method for the dashboard
  getDashboardStats(): Observable<{
  total: number;
  completed: number;
  open: number;
  rate: number;
  newThisWeek: number;
}> {
  return this.http.get<{
    total: number;
    completed: number;
    open: number;
    rate: number;
    newThisWeek: number;
  }>('/api/tasks/dashboard'); // <-- FIXED
}
}
