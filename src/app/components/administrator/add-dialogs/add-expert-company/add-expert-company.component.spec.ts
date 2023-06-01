import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpertCompanyComponent } from './add-expert-company.component';

describe('AddExpertCompanyComponent', () => {
  let component: AddExpertCompanyComponent;
  let fixture: ComponentFixture<AddExpertCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExpertCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpertCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
