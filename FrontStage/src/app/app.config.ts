import { ApplicationConfig } from '@angular/core';            
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from './core/interceptors/auth-token-interceptor';
import { API_URL } from './core/config/tokens';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {               
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideAnimations(),
    { provide: API_URL, useValue: '/api' }
  ],
};
