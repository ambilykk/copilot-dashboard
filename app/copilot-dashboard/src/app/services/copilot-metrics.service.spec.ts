import { TestBed } from '@angular/core/testing';

import { CopilotMetricsService } from './copilot-metrics.service';

describe('CopilotMetricsService', () => {
  let service: CopilotMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopilotMetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
