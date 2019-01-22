/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TasksApiService } from './tasks-api.service';

describe('TasksApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TasksApiService]
    });
  });

  it('should ...', inject([TasksApiService], (service: TasksApiService) => {
    expect(service).toBeTruthy();
  }));
});
