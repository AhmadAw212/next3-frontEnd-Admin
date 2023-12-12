import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesNavComponent } from './profiles-nav.component';

describe('ProfilesNavComponent', () => {
  let component: ProfilesNavComponent;
  let fixture: ComponentFixture<ProfilesNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilesNavComponent]
    });
    fixture = TestBed.createComponent(ProfilesNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
