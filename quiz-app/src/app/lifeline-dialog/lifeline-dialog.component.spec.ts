import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifelineDialogComponent } from './lifeline-dialog.component';

describe('LifelineDialogComponent', () => {
  let component: LifelineDialogComponent;
  let fixture: ComponentFixture<LifelineDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LifelineDialogComponent]
    });
    fixture = TestBed.createComponent(LifelineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
