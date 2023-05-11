import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCoreConfigurationComponent } from './update-core-configuration.component';

describe('UpdateCoreConfigurationComponent', () => {
  let component: UpdateCoreConfigurationComponent;
  let fixture: ComponentFixture<UpdateCoreConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCoreConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCoreConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
