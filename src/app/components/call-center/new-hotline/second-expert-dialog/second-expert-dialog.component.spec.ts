import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondExpertDialogComponent } from './second-expert-dialog.component';

describe('SecondExpertDialogComponent', () => {
  let component: SecondExpertDialogComponent;
  let fixture: ComponentFixture<SecondExpertDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondExpertDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondExpertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
