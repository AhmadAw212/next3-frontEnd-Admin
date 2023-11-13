import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneIndexComponent } from './phone-index.component';

describe('PhoneIndexComponent', () => {
  let component: PhoneIndexComponent;
  let fixture: ComponentFixture<PhoneIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneIndexComponent]
    });
    fixture = TestBed.createComponent(PhoneIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
