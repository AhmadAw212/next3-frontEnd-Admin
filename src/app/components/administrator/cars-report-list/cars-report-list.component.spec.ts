import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsReportListComponent } from './cars-report-list.component';

describe('CarsReportListComponent', () => {
  let component: CarsReportListComponent;
  let fixture: ComponentFixture<CarsReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarsReportListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarsReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
