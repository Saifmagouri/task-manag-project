import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  getItem(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }
  setItem(key: string, value: string): void {
    if (this.isBrowser) localStorage.setItem(key, value);
  }
  removeItem(key: string): void {
    if (this.isBrowser) localStorage.removeItem(key);
  }
  getSession(key: string): string | null {
    return this.isBrowser ? sessionStorage.getItem(key) : null;
  }
  setSession(key: string, value: string): void {
    if (this.isBrowser) sessionStorage.setItem(key, value);
  }
  removeSession(key: string): void {
    if (this.isBrowser) sessionStorage.removeItem(key);
  }
}
