import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCarDialogComponent } from './update-car-dialog.component';

describe('UpdateCarDialogComponent', () => {
  let component: UpdateCarDialogComponent;
  let fixture: ComponentFixture<UpdateCarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCarDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
