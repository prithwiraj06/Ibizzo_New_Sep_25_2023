import { TestBed } from '@angular/core/testing';

import { DigitalFlyerService } from './digital-flyer.service';

describe('DigitalFlyerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DigitalFlyerService = TestBed.get(DigitalFlyerService);
    expect(service).toBeTruthy();
  });
});
