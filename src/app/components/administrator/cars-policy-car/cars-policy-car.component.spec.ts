import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsPolicyCarComponent } from './cars-policy-car.component';

describe('CarsPolicyCarComponent', () => {
  let component: CarsPolicyCarComponent;
  let fixture: ComponentFixture<CarsPolicyCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsPolicyCarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsPolicyCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
