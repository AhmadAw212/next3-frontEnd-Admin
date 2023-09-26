import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHotlineBtnComponent } from './new-hotline-btn.component';

describe('NewHotlineBtnComponent', () => {
  let component: NewHotlineBtnComponent;
  let fixture: ComponentFixture<NewHotlineBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewHotlineBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewHotlineBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
