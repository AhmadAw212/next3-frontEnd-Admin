import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseManuallyComponent } from './choose-manually.component';

describe('ChooseManuallyComponent', () => {
  let component: ChooseManuallyComponent;
  let fixture: ComponentFixture<ChooseManuallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseManuallyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseManuallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
