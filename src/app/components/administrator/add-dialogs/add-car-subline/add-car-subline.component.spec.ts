import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarSublineComponent } from './add-car-subline.component';

describe('AddCarSublineComponent', () => {
  let component: AddCarSublineComponent;
  let fixture: ComponentFixture<AddCarSublineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCarSublineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarSublineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
