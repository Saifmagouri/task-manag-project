import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, FormGroup } from '@angular/forms';
import { ProfileApi, MeDto } from '../../services/profile.api';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  me = signal<MeDto | null>(null);
  loading = signal(true);
  msg = signal<string | null>(null);
  err = signal<string | null>(null);

  profileForm!: FormGroup;
  pwdForm!: FormGroup;

  // UI state
  showCur = signal(false);
  showNew = signal(false);
  showConf = signal(false);
  strength = signal<0 | 1 | 2 | 3 | 4>(0);

  constructor(private fb: FormBuilder, private api: ProfileApi, private auth: AuthService) {}

  ngOnInit(): void {
    this.api.me().subscribe({
      next: (me) => {
        this.me.set(me);
        this.profileForm = this.fb.group({
          username: [me.username, [Validators.required, Validators.minLength(3)]],
        });
        this.pwdForm = this.fb.group({
          currentPassword: ['', Validators.required],
          newPassword: ['', [Validators.required, Validators.minLength(6)]],
          confirm: ['', Validators.required],
        }, { validators: this.same('newPassword','confirm') });

        // live password strength
        this.pwdForm.get('newPassword')!.valueChanges.subscribe(v => this.strength.set(this.computeStrength(v || '')));
        this.loading.set(false);
      },
      error: (e) => { this.err.set(e?.error?.error || 'Impossible de charger le profil'); this.loading.set(false); }
    });
  }

  same(a: string, b: string) {
    return (group: AbstractControl) => {
      const v1 = group.get(a)?.value;
      const v2 = group.get(b)?.value;
      return v1 === v2 ? null : { mismatch: true };
    };
  }

  saveProfile() {
    if (this.profileForm.invalid || !this.me()) return;
    const username = (this.profileForm.value.username || '').trim();
    this.api.updateMe(username).subscribe({
      next: (me) => {
        this.me.set(me);
        const creds = this.auth.credentials;
        if (creds) this.auth.setCredentials({ username: me.username, password: creds.password });
        this.flashMsg('Profil mis à jour');
      },
      error: (e) => this.flashErr(e?.error?.error || 'Échec de la mise à jour')
    });
  }

  changePassword() {
    if (this.pwdForm.invalid) return;
    const { currentPassword, newPassword } = this.pwdForm.value;
    this.api.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        const creds = this.auth.credentials;
        if (creds) this.auth.setCredentials({ username: creds.username, password: newPassword });
        this.pwdForm.reset();
        this.strength.set(0);
        this.flashMsg('Mot de passe mis à jour');
      },
      error: (e) => this.flashErr(e?.error?.error || 'Échec de la mise à jour du mot de passe')
    });
  }

  // --- UI helpers ---
  toggle(field: 'cur'|'new'|'conf') {
    if (field === 'cur') this.showCur.update(v => !v);
    if (field === 'new') this.showNew.update(v => !v);
    if (field === 'conf') this.showConf.update(v => !v);
  }

  avatarLetter(): string {
    const u = this.me()?.username || '';
    return (u[0] || '?').toUpperCase();
  }

  computeStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
    let s = 0;
    if (pw.length >= 6) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[a-z]/.test(pw)) s++;
    if (/\d|[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(s, 4) as 0|1|2|3|4;
  }

  private flashMsg(text: string) {
    this.err.set(null); this.msg.set(text);
    setTimeout(() => this.msg.set(null), 2500);
  }
  private flashErr(text: string) {
    this.msg.set(null); this.err.set(text);
    setTimeout(() => this.err.set(null), 3500);
  }
}
