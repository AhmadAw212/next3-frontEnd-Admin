import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShapeDialogComponent } from './add-shape-dialog.component';

describe('AddShapeDialogComponent', () => {
  let component: AddShapeDialogComponent;
  let fixture: ComponentFixture<AddShapeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddShapeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShapeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
