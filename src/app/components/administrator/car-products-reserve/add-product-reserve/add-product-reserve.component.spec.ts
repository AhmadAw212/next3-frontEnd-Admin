import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductReserveComponent } from './add-product-reserve.component';

describe('AddProductReserveComponent', () => {
  let component: AddProductReserveComponent;
  let fixture: ComponentFixture<AddProductReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductReserveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
