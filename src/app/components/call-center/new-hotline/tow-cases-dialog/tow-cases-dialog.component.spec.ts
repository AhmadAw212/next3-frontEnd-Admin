import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowCasesDialogComponent } from './tow-cases-dialog.component';

describe('TowCasesDialogComponent', () => {
  let component: TowCasesDialogComponent;
  let fixture: ComponentFixture<TowCasesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TowCasesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowCasesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
