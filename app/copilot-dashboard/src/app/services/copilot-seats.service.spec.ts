import { TestBed } from '@angular/core/testing';

import { CopilotSeatsService } from './copilot-seats.service';

describe('CopilotSeatsService', () => {
  let service: CopilotSeatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopilotSeatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
