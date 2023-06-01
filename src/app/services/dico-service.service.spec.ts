import { TestBed } from '@angular/core/testing';

import { DicoServiceService } from './dico-service.service';

describe('DicoServiceService', () => {
  let service: DicoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DicoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
