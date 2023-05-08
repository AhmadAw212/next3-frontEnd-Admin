import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConfigDialogComponent } from './add-config-dialog.component';

describe('AddConfigDialogComponent', () => {
  let component: AddConfigDialogComponent;
  let fixture: ComponentFixture<AddConfigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConfigDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
