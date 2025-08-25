import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AdminApi, AdminUser } from '../../services/admin.api';

@Component({
  selector: 'app-manage-accounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.scss']
})
export class ManageAccountsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(AdminApi);

  users = signal<AdminUser[]>([]);
  loading = signal(true);
  q = signal('');
  showAdd = signal(false);
  toast = signal<string | null>(null);
  err = signal<string | null>(null);

  addForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['USER' as 'USER'|'ADMIN', Validators.required],
  });

  filtered = computed(() => {
    const term = this.q().toLowerCase().trim();
    return term
      ? this.users().filter(u =>
          (''+u.id).includes(term) ||
          u.username.toLowerCase().includes(term) ||
          u.role.toLowerCase().includes(term))
      : this.users();
  });

  ngOnInit() { this.reload(); }

  reload() {
    this.loading.set(true);
    this.api.listUsers().subscribe({
      next: list => { this.users.set(list); this.loading.set(false); },
      error: () => { this.err.set('Failed to load users'); this.loading.set(false); }
    });
  }

  addUser() {
    if (this.addForm.invalid) return;
    const { username, password, role } = this.addForm.value;
    this.api.createUser(username!, password!, role!).subscribe({
      next: u => { this.users.update(xs => [u, ...xs]); this.addForm.reset({ role: 'USER' }); this.showAdd.set(false); this.flash('User added'); },
      error: e => this.err.set(e?.error?.error || 'Add failed')
    });
  }

  deleteUser(u: AdminUser) {
    if (!confirm(`Delete user "${u.username}"?`)) return;
    this.api.deleteUser(u.id).subscribe({
      next: () => { this.users.update(xs => xs.filter(x => x.id !== u.id)); this.flash('User deleted'); },
      error: e => this.err.set(e?.error?.error || 'Delete failed')
    });
  }

  private flash(msg: string) { this.toast.set(msg); setTimeout(() => this.toast.set(null), 2200); }
}
