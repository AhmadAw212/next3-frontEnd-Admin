import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHotlineComponent } from './new-hotline.component';

describe('NewHotlineComponent', () => {
  let component: NewHotlineComponent;
  let fixture: ComponentFixture<NewHotlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewHotlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewHotlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
