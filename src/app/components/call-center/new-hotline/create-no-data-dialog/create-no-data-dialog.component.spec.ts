import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNoDataDialogComponent } from './create-no-data-dialog.component';

describe('CreateNoDataDialogComponent', () => {
  let component: CreateNoDataDialogComponent;
  let fixture: ComponentFixture<CreateNoDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNoDataDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNoDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
