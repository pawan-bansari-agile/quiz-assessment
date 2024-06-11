import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncorrectAnswerDialogComponent } from './incorrect-answer-dialog.component';

describe('IncorrectAnswerDialogComponent', () => {
  let component: IncorrectAnswerDialogComponent;
  let fixture: ComponentFixture<IncorrectAnswerDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncorrectAnswerDialogComponent]
    });
    fixture = TestBed.createComponent(IncorrectAnswerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
