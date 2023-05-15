import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsSupplierComponent } from './cars-supplier.component';

describe('CarsSupplierComponent', () => {
  let component: CarsSupplierComponent;
  let fixture: ComponentFixture<CarsSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
