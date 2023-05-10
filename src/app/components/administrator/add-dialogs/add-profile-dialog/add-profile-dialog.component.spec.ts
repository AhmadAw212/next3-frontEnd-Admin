import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfileDialogComponent } from './add-profile-dialog.component';

describe('AddProfileDialogComponent', () => {
  let component: AddProfileDialogComponent;
  let fixture: ComponentFixture<AddProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProfileDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
