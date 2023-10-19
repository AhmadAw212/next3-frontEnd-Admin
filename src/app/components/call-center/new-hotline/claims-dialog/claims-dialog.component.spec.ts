import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsDialogComponent } from './claims-dialog.component';

describe('ClaimsDialogComponent', () => {
  let component: ClaimsDialogComponent;
  let fixture: ComponentFixture<ClaimsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
