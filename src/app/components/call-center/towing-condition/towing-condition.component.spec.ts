import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowingConditionComponent } from './towing-condition.component';

describe('TowingConditionComponent', () => {
  let component: TowingConditionComponent;
  let fixture: ComponentFixture<TowingConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TowingConditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowingConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
