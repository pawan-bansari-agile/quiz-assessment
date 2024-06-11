import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuitDialogComponent } from './quit-dialog.component';

describe('QuitDialogComponent', () => {
  let component: QuitDialogComponent;
  let fixture: ComponentFixture<QuitDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuitDialogComponent]
    });
    fixture = TestBed.createComponent(QuitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
