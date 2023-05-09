import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarCoverComponent } from './add-car-cover.component';

describe('AddCarCoverComponent', () => {
  let component: AddCarCoverComponent;
  let fixture: ComponentFixture<AddCarCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCarCoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
