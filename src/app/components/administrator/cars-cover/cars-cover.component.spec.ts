import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsCoverComponent } from './cars-cover.component';

describe('CarsCoverComponent', () => {
  let component: CarsCoverComponent;
  let fixture: ComponentFixture<CarsCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsCoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
