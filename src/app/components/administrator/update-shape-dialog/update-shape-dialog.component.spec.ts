import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateShapeDialogComponent } from './update-shape-dialog.component';

describe('UpdateShapeDialogComponent', () => {
  let component: UpdateShapeDialogComponent;
  let fixture: ComponentFixture<UpdateShapeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateShapeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateShapeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
