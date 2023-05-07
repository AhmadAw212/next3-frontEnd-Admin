import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsClientComponent } from './cars-client.component';

describe('CarsClientComponent', () => {
  let component: CarsClientComponent;
  let fixture: ComponentFixture<CarsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
