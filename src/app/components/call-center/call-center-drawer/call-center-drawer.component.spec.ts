import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallCenterDrawerComponent } from './call-center-drawer.component';

describe('CallCenterDrawerComponent', () => {
  let component: CallCenterDrawerComponent;
  let fixture: ComponentFixture<CallCenterDrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CallCenterDrawerComponent]
    });
    fixture = TestBed.createComponent(CallCenterDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
