import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSurveyComponent } from './request-survey.component';

describe('RequestSurveyComponent', () => {
  let component: RequestSurveyComponent;
  let fixture: ComponentFixture<RequestSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestSurveyComponent]
    });
    fixture = TestBed.createComponent(RequestSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
