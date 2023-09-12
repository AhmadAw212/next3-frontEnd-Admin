import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTowingCompanyComponent } from './add-towing-company.component';

describe('AddTowingCompanyComponent', () => {
  let component: AddTowingCompanyComponent;
  let fixture: ComponentFixture<AddTowingCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTowingCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTowingCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
