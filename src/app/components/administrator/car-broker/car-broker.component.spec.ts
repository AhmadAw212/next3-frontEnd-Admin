import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarBrokerComponent } from './car-broker.component';

describe('CarBrokerComponent', () => {
  let component: CarBrokerComponent;
  let fixture: ComponentFixture<CarBrokerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarBrokerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarBrokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
