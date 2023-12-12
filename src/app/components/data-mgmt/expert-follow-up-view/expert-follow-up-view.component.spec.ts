import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertFollowUpViewComponent } from './expert-follow-up-view.component';

describe('ExpertFollowUpViewComponent', () => {
  let component: ExpertFollowUpViewComponent;
  let fixture: ComponentFixture<ExpertFollowUpViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpertFollowUpViewComponent]
    });
    fixture = TestBed.createComponent(ExpertFollowUpViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
