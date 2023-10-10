import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowingDispatchTabComponent } from './towing-dispatch-tab.component';

describe('TowingDispatchTabComponent', () => {
  let component: TowingDispatchTabComponent;
  let fixture: ComponentFixture<TowingDispatchTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TowingDispatchTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowingDispatchTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
