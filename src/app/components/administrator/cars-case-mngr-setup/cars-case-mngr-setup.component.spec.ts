import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsCaseMngrSetupComponent } from './cars-case-mngr-setup.component';

describe('CarsCaseMngrSetupComponent', () => {
  let component: CarsCaseMngrSetupComponent;
  let fixture: ComponentFixture<CarsCaseMngrSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsCaseMngrSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsCaseMngrSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
