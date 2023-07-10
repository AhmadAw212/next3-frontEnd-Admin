import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbrandMatchingComponent } from './addbrand-matching.component';

describe('AddbrandMatchingComponent', () => {
  let component: AddbrandMatchingComponent;
  let fixture: ComponentFixture<AddbrandMatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddbrandMatchingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddbrandMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
