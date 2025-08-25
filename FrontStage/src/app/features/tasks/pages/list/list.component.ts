import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import type { Task } from '../../models/task';
import { TasksService } from '../../services/tasks.service';
import { TaskDialogComponent } from './task-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog.component';

@Component({
  standalone: true,
  selector: 'app-tasks-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatDividerModule, MatSnackBarModule,
    MatDialogModule, MatTooltipModule, MatMenuModule, MatButtonToggleModule
  ]
})
export class ListComponent implements OnInit {
  private api = inject(TasksService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  username = localStorage.getItem('username') ?? 'Utilisateur';

  loading = false;
  error: string | null = null;

  tasks: Task[] = [];
  q = new FormControl<string>('', { nonNullable: true });

  statusFilter: 'all' | 'open' | 'done' = 'all';
  sortBy: 'alpha' | 'status' = 'alpha';

  ngOnInit() { this.load(); }

  trackById = (_: number, t: Task) => t.id;
  get total() { return this.tasks.length; }
  get openCount() { return this.tasks.filter(t => !t.completed).length; }

  get view(): Task[] {
    let arr = [...this.tasks];

    if (this.statusFilter !== 'all') {
      const wantDone = this.statusFilter === 'done';
      arr = arr.filter(t => t.completed === wantDone);
    }

    const s = (this.q.value ?? '').trim().toLowerCase();
    if (s) {
      arr = arr.filter(t =>
        t.title.toLowerCase().includes(s) ||
        (t.description ?? '').toLowerCase().includes(s)
      );
    }

    if (this.sortBy === 'alpha') {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      arr.sort((a, b) =>
        Number(a.completed) - Number(b.completed) || a.title.localeCompare(b.title)
      );
    }
    return arr;
  }

  load() {
    this.loading = true; this.error = null;
    this.api.list().pipe(finalize(() => this.loading = false)).subscribe({
      next: t => this.tasks = t,
      error: () => this.error = 'Impossible de charger les tâches.'
    });
  }

  openCreate() {
    this.dialog.open(TaskDialogComponent, { data: { mode: 'create' } })
      .afterClosed().subscribe(v => {
        if (!v) return;
        this.api.add(v.title, v.description ?? '')
          .subscribe(task => {
            this.tasks = [task, ...this.tasks];
            this.snack.open('Tâche créée', 'OK', { duration: 1200 });
          });
      });
  }

  openEdit(t: Task) {
    this.dialog.open(TaskDialogComponent, { data: { mode: 'edit', task: t } })
      .afterClosed().subscribe(v => {
        if (!v) return;
        this.api.update(t.id, v).subscribe(updated => {
          Object.assign(t, updated);
          this.snack.open('Tâche mise à jour', 'OK', { duration: 1200 });
        });
      });
  }

  toggle(t: Task) {
    this.api.toggle(t.id, !t.completed).subscribe(updated => Object.assign(t, updated));
  }

  remove(t: Task) {
  this.dialog.open(TaskDialogComponent, {
    data: { mode: 'delete', task: t }
  }).afterClosed().subscribe(result => {
    if (!result?.delete) return;
    this.api.remove(t.id).subscribe(() => {
      this.tasks = this.tasks.filter(x => x.id !== t.id);
      this.snack.open('Tâche supprimée', 'OK', { duration: 1200 });
    });
  });
}

}
