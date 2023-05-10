import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarProductComponent } from './add-car-product.component';

describe('AddCarProductComponent', () => {
  let component: AddCarProductComponent;
  let fixture: ComponentFixture<AddCarProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCarProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCarProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
