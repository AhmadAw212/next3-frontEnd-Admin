import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarProductsComponent } from './car-products.component';

describe('CarProductsComponent', () => {
  let component: CarProductsComponent;
  let fixture: ComponentFixture<CarProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
