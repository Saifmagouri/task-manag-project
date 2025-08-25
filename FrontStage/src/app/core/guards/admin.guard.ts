import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

type MeDto = { id: number; username: string; role: 'USER'|'ADMIN' };

export const adminGuard: CanActivateFn = () => {
  const http = inject(HttpClient);
  const router = inject(Router);
  return http.get<MeDto>('/api/users/me').pipe(
    map(me => me.role === 'ADMIN' ? true : router.createUrlTree(['/'])),
    catchError(() => of(inject(Router).createUrlTree(['/'])))
  );
};
