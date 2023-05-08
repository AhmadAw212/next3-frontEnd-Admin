import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyProfileComponent } from './copy-profile.component';

describe('CopyProfileComponent', () => {
  let component: CopyProfileComponent;
  let fixture: ComponentFixture<CopyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
