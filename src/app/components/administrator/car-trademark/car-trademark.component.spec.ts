import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarTrademarkComponent } from './car-trademark.component';

describe('CarTrademarkComponent', () => {
  let component: CarTrademarkComponent;
  let fixture: ComponentFixture<CarTrademarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarTrademarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarTrademarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
