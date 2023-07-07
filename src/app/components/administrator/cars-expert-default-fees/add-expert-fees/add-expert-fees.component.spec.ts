import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpertFeesComponent } from './add-expert-fees.component';

describe('AddExpertFeesComponent', () => {
  let component: AddExpertFeesComponent;
  let fixture: ComponentFixture<AddExpertFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExpertFeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpertFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
