import { TestBed } from '@angular/core/testing';

import { ProjectsApiService } from './projects-api.service';

describe('ProjectsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectsApiService = TestBed.get(ProjectsApiService);
    expect(service).toBeTruthy();
  });
});
