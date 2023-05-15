import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReportListComponent } from './add-report-list.component';

describe('AddReportListComponent', () => {
  let component: AddReportListComponent;
  let fixture: ComponentFixture<AddReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReportListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
