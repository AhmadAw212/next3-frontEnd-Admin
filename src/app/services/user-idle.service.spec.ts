import { TestBed } from '@angular/core/testing';

import { UserIdleService } from './users-idle.service';

describe('UserIdleService', () => {
  let service: UserIdleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIdleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
