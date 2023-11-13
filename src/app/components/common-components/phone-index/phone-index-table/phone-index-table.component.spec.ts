import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneIndexTableComponent } from './phone-index-table.component';

describe('PhoneIndexTableComponent', () => {
  let component: PhoneIndexTableComponent;
  let fixture: ComponentFixture<PhoneIndexTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneIndexTableComponent]
    });
    fixture = TestBed.createComponent(PhoneIndexTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
