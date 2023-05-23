import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertConfigComponent } from './expert-config.component';

describe('ExpertConfigComponent', () => {
  let component: ExpertConfigComponent;
  let fixture: ComponentFixture<ExpertConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
