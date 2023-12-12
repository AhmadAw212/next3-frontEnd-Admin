import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyGaugesComponent } from './survey-gauges.component';

describe('SurveyGaugesComponent', () => {
  let component: SurveyGaugesComponent;
  let fixture: ComponentFixture<SurveyGaugesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyGaugesComponent]
    });
    fixture = TestBed.createComponent(SurveyGaugesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
