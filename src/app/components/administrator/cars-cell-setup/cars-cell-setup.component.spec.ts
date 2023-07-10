import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsCellSetupComponent } from './cars-cell-setup.component';

describe('CarsCellSetupComponent', () => {
  let component: CarsCellSetupComponent;
  let fixture: ComponentFixture<CarsCellSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsCellSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsCellSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
