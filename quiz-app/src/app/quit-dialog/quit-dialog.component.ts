import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-quit-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.message }}</h2>
    <mat-dialog-actions>
      <button mat-button (click)="onClose()">OK</button>
    </mat-dialog-actions>
  `,
})
export class QuitDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<QuitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
