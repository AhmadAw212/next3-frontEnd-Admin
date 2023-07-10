import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsCellComponent } from './cars-cell.component';

describe('CarsCellComponent', () => {
  let component: CarsCellComponent;
  let fixture: ComponentFixture<CarsCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsCellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
