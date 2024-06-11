import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCompletionDialogComponent } from './game-completion-dialog.component';

describe('GameCompletionDialogComponent', () => {
  let component: GameCompletionDialogComponent;
  let fixture: ComponentFixture<GameCompletionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameCompletionDialogComponent]
    });
    fixture = TestBed.createComponent(GameCompletionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
