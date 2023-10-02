import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotationDialogComponent } from './rotation-dialog.component';

describe('RotationDialogComponent', () => {
  let component: RotationDialogComponent;
  let fixture: ComponentFixture<RotationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RotationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RotationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
