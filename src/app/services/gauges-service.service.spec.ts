import { TestBed } from '@angular/core/testing';

import { GaugesServiceService } from './gauges-service.service';

describe('GaugesServiceService', () => {
  let service: GaugesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GaugesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
