import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodilyInjuryComponent } from './bodily-injury.component';

describe('BodilyInjuryComponent', () => {
  let component: BodilyInjuryComponent;
  let fixture: ComponentFixture<BodilyInjuryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BodilyInjuryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodilyInjuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
