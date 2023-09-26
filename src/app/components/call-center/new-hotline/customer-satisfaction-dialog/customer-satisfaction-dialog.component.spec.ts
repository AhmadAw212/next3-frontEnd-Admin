import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSatisfactionDialogComponent } from './customer-satisfaction-dialog.component';

describe('CustomerSatisfactionDialogComponent', () => {
  let component: CustomerSatisfactionDialogComponent;
  let fixture: ComponentFixture<CustomerSatisfactionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSatisfactionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSatisfactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
