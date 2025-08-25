import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type AdminUser = { id: number; username: string; role: 'USER'|'ADMIN' };

@Injectable({ providedIn: 'root' })
export class AdminApi {
  constructor(private http: HttpClient) {}

  listUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>('/api/admin/users');
  }
  createUser(username: string, password: string, role: 'USER'|'ADMIN') {
    return this.http.post<AdminUser>('/api/admin/users', { username, password, role });
  }
  deleteUser(id: number) {
    return this.http.delete<void>(`/api/admin/users/${id}`);
  }
}
