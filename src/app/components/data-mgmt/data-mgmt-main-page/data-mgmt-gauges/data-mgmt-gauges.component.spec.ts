import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMgmtGaugesComponent } from './data-mgmt-gauges.component';

describe('DataMgmtGaugesComponent', () => {
  let component: DataMgmtGaugesComponent;
  let fixture: ComponentFixture<DataMgmtGaugesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataMgmtGaugesComponent]
    });
    fixture = TestBed.createComponent(DataMgmtGaugesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
