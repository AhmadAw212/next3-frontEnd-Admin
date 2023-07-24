import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPolicyDialogComponent } from './view-policy-dialog.component';

describe('ViewPolicyDialogComponent', () => {
  let component: ViewPolicyDialogComponent;
  let fixture: ComponentFixture<ViewPolicyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPolicyDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPolicyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
