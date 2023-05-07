import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarBrandDialogComponent } from './add-car-brand-dialog.component';

describe('AddCarBrandDialogComponent', () => {
  let component: AddCarBrandDialogComponent;
  let fixture: ComponentFixture<AddCarBrandDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCarBrandDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarBrandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
