import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type MeDto = { id: number; username: string; role: string };

@Injectable({ providedIn: 'root' })
export class ProfileApi {
  constructor(private http: HttpClient) {}

  me(): Observable<MeDto> {
    return this.http.get<MeDto>('/api/users/me');
  }

  updateMe(username: string): Observable<MeDto> {
    return this.http.put<MeDto>('/api/users/me', { username });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{message: string}> {
    return this.http.put<{message: string}>('/api/users/me/password', { currentPassword, newPassword });
  }
}
