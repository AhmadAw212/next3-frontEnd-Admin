import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarInfoComponent } from './add-car-info.component';

describe('AddCarInfoComponent', () => {
  let component: AddCarInfoComponent;
  let fixture: ComponentFixture<AddCarInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCarInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
