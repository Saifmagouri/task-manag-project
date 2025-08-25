import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service'; // ← up one to /core, then /services

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const raw = storage.getItem('creds');
  if (!raw) return next(req);
  try {
    const { username, password } = JSON.parse(raw) as { username: string; password: string };
    const basic = btoa(`${username}:${password}`);
    return next(req.clone({ setHeaders: { Authorization: `Basic ${basic}` } }));
  } catch {
    return next(req);
  }
};
