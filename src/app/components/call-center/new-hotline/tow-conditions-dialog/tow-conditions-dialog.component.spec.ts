import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowConditionsDialogComponent } from './tow-conditions-dialog.component';

describe('TowConditionsDialogComponent', () => {
  let component: TowConditionsDialogComponent;
  let fixture: ComponentFixture<TowConditionsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TowConditionsDialogComponent]
    });
    fixture = TestBed.createComponent(TowConditionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
