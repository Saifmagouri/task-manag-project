import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';   
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  // Public
  { path: 'auth/login', loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(m => m.LoginComponent) },

  // Private area with sidebar shell
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () =>
          import('./features/dashboard/pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'tasks', loadComponent: () =>
          import('./features/tasks/pages/list/list.component').then(m => m.ListComponent) },
      { path: 'profile', loadComponent: () =>
          import('./features/profile/pages/info/info.component').then(m => m.InfoComponent) },

      
      { path: 'admin/manage-accounts', loadComponent: () =>
          import('./features/admin/pages/manage-accounts/manage-accounts.component')
            .then(m => m.ManageAccountsComponent),
        canActivate: [adminGuard]
      },

      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ]
  },

  { path: '**', redirectTo: '' }
];
