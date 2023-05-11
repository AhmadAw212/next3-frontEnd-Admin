import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCarCoverComponent } from './update-car-cover.component';

describe('UpdateCarCoverComponent', () => {
  let component: UpdateCarCoverComponent;
  let fixture: ComponentFixture<UpdateCarCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCarCoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCarCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
