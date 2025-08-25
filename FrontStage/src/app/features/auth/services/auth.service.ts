import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_URL } from '../../../core/config/tokens';
import { StorageService } from '../../../core/services/storage.service';

export interface LoginResponse { token: string; }
export type Creds = { username: string; password: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'creds';
  private _creds: Creds | null = null;

  constructor(
    private http: HttpClient,
    @Inject(API_URL) private api: string,
    private storage: StorageService
  ) {
    const raw = this.storage.getItem(this.key);
    this._creds = raw ? JSON.parse(raw) as Creds : null;
  }

  get credentials(): Creds | null { return this._creds; }
  get isLoggedIn(): boolean { return !!this._creds; }

  setCredentials(creds: Creds | null) {
    this._creds = creds;
    if (creds) this.storage.setItem(this.key, JSON.stringify(creds));
    else this.storage.removeItem(this.key);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/auth/login`, { username, password }).pipe(
      tap(r => {
        
        this.storage.setItem('token', r.token);
        
        this.setCredentials({ username, password });
      })
    );
  }

  logout() {
    this.setCredentials(null);
    this.storage.removeItem('token');
    this.storage.removeSession('token');
  }

  
  get token(): string | null {
    return this.storage.getItem('token') ?? this.storage.getSession('token');
  }
}
