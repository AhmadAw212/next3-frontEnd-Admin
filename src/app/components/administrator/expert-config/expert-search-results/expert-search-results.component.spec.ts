import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertSearchResultsComponent } from './expert-search-results.component';

describe('ExpertSearchResultsComponent', () => {
  let component: ExpertSearchResultsComponent;
  let fixture: ComponentFixture<ExpertSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertSearchResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
