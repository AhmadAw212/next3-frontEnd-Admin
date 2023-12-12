import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyMainPageComponent } from './survey-main-page.component';

describe('SurveyMainPageComponent', () => {
  let component: SurveyMainPageComponent;
  let fixture: ComponentFixture<SurveyMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyMainPageComponent]
    });
    fixture = TestBed.createComponent(SurveyMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
