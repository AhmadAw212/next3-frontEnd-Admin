import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarProductsReserveComponent } from './car-products-reserve.component';

describe('CarProductsReserveComponent', () => {
  let component: CarProductsReserveComponent;
  let fixture: ComponentFixture<CarProductsReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarProductsReserveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarProductsReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
