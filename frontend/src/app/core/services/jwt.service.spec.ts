import { TestBed } from '@angular/core/testing';

import { JwtService } from './jwt.service';

describe('JwtServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JwtService = TestBed.get(JwtService);
    expect(service).toBeTruthy();
  });
});
