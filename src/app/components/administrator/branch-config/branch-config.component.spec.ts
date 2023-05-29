import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchConfigComponent } from './branch-config.component';

describe('BranchConfigComponent', () => {
  let component: BranchConfigComponent;
  let fixture: ComponentFixture<BranchConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
