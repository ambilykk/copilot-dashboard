import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotUsageComponent } from './copilot-usage.component';

describe('CopilotUsageComponent', () => {
  let component: CopilotUsageComponent;
  let fixture: ComponentFixture<CopilotUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CopilotUsageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CopilotUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
