import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsBrandComponent } from './cars-brand.component';

describe('CarsBrandComponent', () => {
  let component: CarsBrandComponent;
  let fixture: ComponentFixture<CarsBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsBrandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
