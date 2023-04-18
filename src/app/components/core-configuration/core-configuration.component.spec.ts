import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreConfigurationComponent } from './core-configuration.component';

describe('CoreConfigurationComponent', () => {
  let component: CoreConfigurationComponent;
  let fixture: ComponentFixture<CoreConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoreConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
