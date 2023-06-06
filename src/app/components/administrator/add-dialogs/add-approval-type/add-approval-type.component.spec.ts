import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApprovalTypeComponent } from './add-approval-type.component';

describe('AddApprovalTypeComponent', () => {
  let component: AddApprovalTypeComponent;
  let fixture: ComponentFixture<AddApprovalTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddApprovalTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApprovalTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
