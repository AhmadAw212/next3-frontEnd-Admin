import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesDropdownComponent } from './companies-dropdown.component';

describe('CompaniesDropdownComponent', () => {
  let component: CompaniesDropdownComponent;
  let fixture: ComponentFixture<CompaniesDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
