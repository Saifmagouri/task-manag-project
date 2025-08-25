import { Component, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

type Mode = 'create' | 'edit' | 'delete';
export interface TaskDialogData {
  mode: Mode;
  task?: { id: number; title: string; description?: string; completed: boolean };
}

@Component({
  standalone: true,
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  encapsulation: ViewEncapsulation.None // Disable encapsulation to apply global styles
})
export class TaskDialogComponent {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<TaskDialogComponent>);
  data = inject<TaskDialogData>(MAT_DIALOG_DATA);

  saving = false;
  get isEdit() { return this.data.mode === 'edit'; }
  get isDelete() { return this.data.mode === 'delete'; }

  form = this.fb.group({
    title: [this.data.task?.title ?? '', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    description: [this.data.task?.description ?? '', [Validators.maxLength(240)]],
    completed: [this.data.task?.completed ?? false]
  });

  submit() {
    if (this.form.invalid || this.saving) return;
    this.saving = true;
    setTimeout(() => this.ref.close(this.form.getRawValue()), 120);
  }

  closeDialog(result?: any) {
    this.ref.close(result);
  }
}
