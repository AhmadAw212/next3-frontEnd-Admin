import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRiskCoverComponent } from './car-risk-cover.component';

describe('CarRiskCoverComponent', () => {
  let component: CarRiskCoverComponent;
  let fixture: ComponentFixture<CarRiskCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarRiskCoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarRiskCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
