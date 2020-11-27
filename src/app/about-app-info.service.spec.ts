import { TestBed } from '@angular/core/testing';

import { AboutAppInfoService } from './about-app-info.service';

describe('AboutAppInfoService', () => {
  let service: AboutAppInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AboutAppInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
