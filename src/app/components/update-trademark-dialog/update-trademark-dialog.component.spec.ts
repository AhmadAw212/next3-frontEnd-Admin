import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTrademarkDialogComponent } from './update-trademark-dialog.component';

describe('UpdateTrademarkDialogComponent', () => {
  let component: UpdateTrademarkDialogComponent;
  let fixture: ComponentFixture<UpdateTrademarkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTrademarkDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTrademarkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
