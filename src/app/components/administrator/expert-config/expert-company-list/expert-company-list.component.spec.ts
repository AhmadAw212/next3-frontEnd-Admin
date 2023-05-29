import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertCompanyListComponent } from './expert-company-list.component';

describe('ExpertCompanyListComponent', () => {
  let component: ExpertCompanyListComponent;
  let fixture: ComponentFixture<ExpertCompanyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertCompanyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertCompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
