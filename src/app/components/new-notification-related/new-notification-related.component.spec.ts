import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNotificationRelatedComponent } from './new-notification-related.component';

describe('NewNotificationRelatedComponent', () => {
  let component: NewNotificationRelatedComponent;
  let fixture: ComponentFixture<NewNotificationRelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewNotificationRelatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewNotificationRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
