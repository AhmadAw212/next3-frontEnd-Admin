import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowingConditionsHotlineComponent } from './towing-conditions-hotline.component';

describe('TowingConditionsHotlineComponent', () => {
  let component: TowingConditionsHotlineComponent;
  let fixture: ComponentFixture<TowingConditionsHotlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TowingConditionsHotlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowingConditionsHotlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
