import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertDispatchComponent } from './expert-dispatch.component';

describe('ExpertDispatchComponent', () => {
  let component: ExpertDispatchComponent;
  let fixture: ComponentFixture<ExpertDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertDispatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
