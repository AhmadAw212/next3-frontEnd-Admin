import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCarSuppFormComponent } from './update-car-supp-form.component';

describe('UpdateCarSuppFormComponent', () => {
  let component: UpdateCarSuppFormComponent;
  let fixture: ComponentFixture<UpdateCarSuppFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCarSuppFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCarSuppFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
