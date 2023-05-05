import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrademarkDialogComponent } from './add-trademark-dialog.component';

describe('AddTrademarkDialogComponent', () => {
  let component: AddTrademarkDialogComponent;
  let fixture: ComponentFixture<AddTrademarkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrademarkDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrademarkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
