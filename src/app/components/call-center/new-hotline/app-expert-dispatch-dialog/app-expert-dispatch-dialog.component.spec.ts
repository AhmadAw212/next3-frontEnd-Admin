import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppExpertDispatchDialogComponent } from './app-expert-dispatch-dialog.component';

describe('AppExpertDispatchDialogComponent', () => {
  let component: AppExpertDispatchDialogComponent;
  let fixture: ComponentFixture<AppExpertDispatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppExpertDispatchDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppExpertDispatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
