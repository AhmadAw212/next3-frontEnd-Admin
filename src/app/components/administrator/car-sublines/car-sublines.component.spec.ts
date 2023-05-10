import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarSublinesComponent } from './car-sublines.component';

describe('CarSublinesComponent', () => {
  let component: CarSublinesComponent;
  let fixture: ComponentFixture<CarSublinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarSublinesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarSublinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
