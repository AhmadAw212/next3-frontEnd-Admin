import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimLabelReportComponent } from './claim-label-report.component';

describe('ClaimLabelReportComponent', () => {
  let component: ClaimLabelReportComponent;
  let fixture: ComponentFixture<ClaimLabelReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimLabelReportComponent]
    });
    fixture = TestBed.createComponent(ClaimLabelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
