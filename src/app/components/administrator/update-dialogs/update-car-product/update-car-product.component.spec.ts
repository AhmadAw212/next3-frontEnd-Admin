import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCarProductComponent } from './update-car-product.component';

describe('UpdateCarProductComponent', () => {
  let component: UpdateCarProductComponent;
  let fixture: ComponentFixture<UpdateCarProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCarProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCarProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
