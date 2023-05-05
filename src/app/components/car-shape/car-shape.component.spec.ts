import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarShapeComponent } from './car-shape.component';

describe('CarShapeComponent', () => {
  let component: CarShapeComponent;
  let fixture: ComponentFixture<CarShapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarShapeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
