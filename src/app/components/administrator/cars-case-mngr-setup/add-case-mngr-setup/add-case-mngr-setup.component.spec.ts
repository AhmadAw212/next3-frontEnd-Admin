import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCaseMngrSetupComponent } from './add-case-mngr-setup.component';

describe('AddCaseMngrSetupComponent', () => {
  let component: AddCaseMngrSetupComponent;
  let fixture: ComponentFixture<AddCaseMngrSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCaseMngrSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCaseMngrSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
