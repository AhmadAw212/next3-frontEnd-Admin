import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompanyListComponent } from './update-company-list.component';

describe('UpdateCompanyListComponent', () => {
  let component: UpdateCompanyListComponent;
  let fixture: ComponentFixture<UpdateCompanyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCompanyListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCompanyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
