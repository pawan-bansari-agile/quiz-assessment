import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-incorrect-answer-dialog',
  template: `
    <h2 mat-dialog-title>Incorrect Answer!</h2>
    <mat-dialog-content>
      <p>The correct answer is: {{ data.correctAnswer }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onClose()">OK</button>
    </mat-dialog-actions>
  `,
})
export class IncorrectAnswerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<IncorrectAnswerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { correctAnswer: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
