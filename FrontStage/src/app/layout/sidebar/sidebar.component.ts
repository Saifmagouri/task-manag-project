import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../features/auth/services/auth.service';

type MeDto = { id: number; username: string; role: 'USER' | 'ADMIN' };

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);

  me$ = this.http.get<MeDto>('/api/users/me').pipe(shareReplay(1));
  isAdmin$ = this.me$.pipe(map(me => me.role === 'ADMIN'));

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
