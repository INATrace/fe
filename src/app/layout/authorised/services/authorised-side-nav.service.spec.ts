import { TestBed } from '@angular/core/testing';

import { AuthorisedSideNavService } from './authorised-side-nav.service';

describe('AuthorisedSideNavService', () => {
  let service: AuthorisedSideNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorisedSideNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
