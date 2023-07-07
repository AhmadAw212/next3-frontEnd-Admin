import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarBrandMatchingComponent } from './car-brand-matching.component';

describe('CarBrandMatchingComponent', () => {
  let component: CarBrandMatchingComponent;
  let fixture: ComponentFixture<CarBrandMatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarBrandMatchingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarBrandMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
