import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarClientComponent } from './add-car-client.component';

describe('AddCarClientComponent', () => {
  let component: AddCarClientComponent;
  let fixture: ComponentFixture<AddCarClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCarClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
