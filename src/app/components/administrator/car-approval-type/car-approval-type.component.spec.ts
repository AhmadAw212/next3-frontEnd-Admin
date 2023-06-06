import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarApprovalTypeComponent } from './car-approval-type.component';

describe('CarApprovalTypeComponent', () => {
  let component: CarApprovalTypeComponent;
  let fixture: ComponentFixture<CarApprovalTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarApprovalTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarApprovalTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
