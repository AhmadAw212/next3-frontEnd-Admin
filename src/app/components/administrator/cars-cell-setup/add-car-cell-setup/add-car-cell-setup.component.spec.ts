import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarCellSetupComponent } from './add-car-cell-setup.component';

describe('AddCarCellSetupComponent', () => {
  let component: AddCarCellSetupComponent;
  let fixture: ComponentFixture<AddCarCellSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCarCellSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarCellSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
