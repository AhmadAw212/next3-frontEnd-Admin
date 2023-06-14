import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDamageComponent } from './material-damage.component';

describe('MaterialDamageComponent', () => {
  let component: MaterialDamageComponent;
  let fixture: ComponentFixture<MaterialDamageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialDamageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
