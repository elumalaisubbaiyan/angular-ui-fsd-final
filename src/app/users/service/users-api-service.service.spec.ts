import { TestBed } from '@angular/core/testing';

import { UsersApiServiceService } from './users-api-service.service';

describe('UsersApiServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsersApiServiceService = TestBed.get(UsersApiServiceService);
    expect(service).toBeTruthy();
  });
});
