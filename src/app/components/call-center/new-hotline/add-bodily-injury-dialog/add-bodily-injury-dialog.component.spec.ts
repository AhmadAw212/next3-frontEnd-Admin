import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBodilyInjuryDialogComponent } from './add-bodily-injury-dialog.component';

describe('AddBodilyInjuryDialogComponent', () => {
  let component: AddBodilyInjuryDialogComponent;
  let fixture: ComponentFixture<AddBodilyInjuryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBodilyInjuryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBodilyInjuryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
