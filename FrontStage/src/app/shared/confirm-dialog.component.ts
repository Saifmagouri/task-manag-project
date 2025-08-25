import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h3 mat-dialog-title>Confirmer</h3>
    <div class="mat-dialog-content">{{ data.message }}</div>
    <div class="mat-dialog-actions" style="display:flex; gap:8px; justify-content:flex-end;">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Supprimer</button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
