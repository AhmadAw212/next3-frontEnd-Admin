import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNotificationComponent } from './search-notification.component';

describe('SearchNotificationComponent', () => {
  let component: SearchNotificationComponent;
  let fixture: ComponentFixture<SearchNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
