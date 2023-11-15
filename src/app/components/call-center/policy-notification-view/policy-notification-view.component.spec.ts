import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyNotificationViewComponent } from './policy-notification-view.component';

describe('PolicyNotificationViewComponent', () => {
  let component: PolicyNotificationViewComponent;
  let fixture: ComponentFixture<PolicyNotificationViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyNotificationViewComponent]
    });
    fixture = TestBed.createComponent(PolicyNotificationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
