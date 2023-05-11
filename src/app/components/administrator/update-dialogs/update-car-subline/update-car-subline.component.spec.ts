import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCarSublineComponent } from './update-car-subline.component';

describe('UpdateCarSublineComponent', () => {
  let component: UpdateCarSublineComponent;
  let fixture: ComponentFixture<UpdateCarSublineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCarSublineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCarSublineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
