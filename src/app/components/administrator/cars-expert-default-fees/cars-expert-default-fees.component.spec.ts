import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsExpertDefaultFeesComponent } from './cars-expert-default-fees.component';

describe('CarsExpertDefaultFeesComponent', () => {
  let component: CarsExpertDefaultFeesComponent;
  let fixture: ComponentFixture<CarsExpertDefaultFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsExpertDefaultFeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsExpertDefaultFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
