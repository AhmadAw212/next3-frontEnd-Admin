import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarSupplierComponent } from './add-car-supplier.component';

describe('AddCarSupplierComponent', () => {
  let component: AddCarSupplierComponent;
  let fixture: ComponentFixture<AddCarSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCarSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
