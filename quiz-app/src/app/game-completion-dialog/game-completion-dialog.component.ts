import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-game-completion-dialog',
  template: `
    <h2 mat-dialog-title>Congratulations!</h2>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
      <p>You have won Rs {{ data.prizeMoney }}.</p>
    </div>
    <mat-dialog-actions>
      <button mat-button (click)="onClose()">OK</button>
    </mat-dialog-actions>
  `,
})
export class GameCompletionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GameCompletionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; prizeMoney: number }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
