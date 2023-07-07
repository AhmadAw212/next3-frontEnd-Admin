import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiskCoverComponent } from './add-risk-cover.component';

describe('AddRiskCoverComponent', () => {
  let component: AddRiskCoverComponent;
  let fixture: ComponentFixture<AddRiskCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRiskCoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRiskCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
