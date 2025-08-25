import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatCheckboxModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatDividerModule, MatTooltipModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  loading = false;
  error: string | null = null;
  hide = true; 

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', Validators.required],
    remember: [true]
  });

  get f() { return this.form.controls; }

  fillDefaults() {
    this.form.patchValue({ username: 'superadmin', password: 'superadmin' });
  }

  submit() {
    if (this.form.invalid || this.loading) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = null;

    const { username, password, remember } = this.form.getRawValue();

    this.auth.login(username!, password!)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          localStorage.setItem('username', username!);

          if (!remember) {
            const t = localStorage.getItem('token');
            if (t) { sessionStorage.setItem('token', t); localStorage.removeItem('token'); }
          }

          this.snack.open(`Connecté en tant que ${username}`, 'OK', { duration: 1500 });
          this.router.navigate(['/dashboard']).catch(() => this.error = 'Page de destination introuvable.');
        },
        error: e => this.error = e?.status === 0 ? 'Serveur indisponible.' : 'Identifiants invalides.'
      });
  }
}
